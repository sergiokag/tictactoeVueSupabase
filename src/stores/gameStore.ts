import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { useShowErrorMessage } from '@/composables/userShowErrorMessage'

interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          created_at: Date
          updated_at: Date
          finished_at: Date | null
          player_x: string
          player_o: string
          board: string
          current_turn: string
          status: string
          turn_number: number
        }
      }
    }
  }
}

type Game = Database['public']['Tables']['games']['Row']

export const useGameStore = defineStore('game', () => {
  const { showError } = useShowErrorMessage()

  const game = ref<Game | null>(null)
  const user = ref<User | null>(null)

  async function initSession() {
    const { data } = await supabase.auth.signInAnonymously()
    user.value = data.user
  }

  async function createGame() {
    const { data, error } = await supabase
      .from('games')
      .insert({
        player_x: user?.value?.id,
        board: '---------',
        current_turn: 'X',
        status: 'waiting',
      })
      .select()
      .single()

    if (error) {
      showError(error.message)
      return
    }

    game.value = data
    subscribeToGame(data.id)
  }

  async function joinGame(gameId: string) {
    const { data, error } = await supabase.rpc('join_game_rpc', {
      game_id: gameId,
      player_id: user?.value?.id as string,
    })
    if (error) {
      showError(error.message)
      return
    }
    game.value = data
    subscribeToGame(gameId)
  }

  async function makeMove(pos: number) {
    if (!game.value) return

    const mark = user?.value?.id === game.value?.player_x ? 'X' : 'O'

    await supabase.rpc('apply_move_rpc', {
      game_id: game.value.id,
      player_id: user?.value?.id,
      pos,
      mark,
    })
  }

  async function restartGame() {
    if (!game.value) return

    await supabase
      .from('games')
      .update({
        board: '---------',
        current_turn: 'X',
        status: 'in_progress',
        finished_at: null,
        turn_number: 0,
      })
      .eq('id', game.value.id)
  }

  async function cancelGame(gameId: string) {
    await supabase
      .from('games')
      .update({ status: 'canceled', finished_at: new Date().toISOString() })
      .eq('id', gameId)
  }

  function subscribeToGame(gameId: string) {
    supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` },
        (payload) => {
          game.value = payload.new as Game
          if (payload.new.status === 'canceled') {
            showError(`The match was canceled.
              You can start a new game anytime.`)
            supabase.channel(`game:${game.value.id}`).unsubscribe()
            game.value = null
            return
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` },
        () => {
          // Game has been deleted by cleanup job
          game.value = null
          alert('This game has expired or was cleaned up.')
        },
      )
      .subscribe((status) => console.log('SUB STATUS: ', status))
  }

  function leaveGame() {
    if (!game.value) {
      return
    }
    if (game.value.status === 'in_progress') {
      cancelGame(game.value.id)
      return
    }
    supabase.channel(`game:${game.value.id}`).unsubscribe()
    game.value = null
  }

  return {
    game,
    user,
    initSession,
    createGame,
    joinGame,
    makeMove,
    leaveGame,
    restartGame,
  }
})
