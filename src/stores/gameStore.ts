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
    console.log('Current user:', user.value)
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
    await supabase
      .from('games')
      .update({
        board: '---------',
        current_turn: 'X',
        status: 'in_progress',
      })
      .eq('id', game.value.id);
  }

  function subscribeToGame(gameId: string) {
    supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` },
        (payload) => {
          game.value = payload.new as Game
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
    if (game.value) {
      supabase.channel(`game:${game.value.id}`).unsubscribe()
    }
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
