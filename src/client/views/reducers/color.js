import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'


export const addPalette = createAction('ADD_PALETTE')
export const editPalette = createAction('EDIT_PALETTE')

export const palettes = handleActions(
  {
    ADD_PALETTE: (state, action) => (
      immutableUpdate(state, {
        byId: { [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id]
      })
    ),
    EDIT_PALETTE: (state, action) => {
      let id = action.payload.id
      let fields = Object.keys(action.payload).filter((key)=>{return key != 'id'})
      return immutableUpdate(state, {
        byId: {
          [id]: Object.assign(...fields.map(f => ({[f]: action.payload[f]})))
        }
      })
    }
  },
  {
    byId: {default:['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)']},
    allIds: ['default']
  }
)


export const selectPalette = createAction('SELECT_PALETTE')

export const selectedPalette = handleAction(
  'SELECT_PALETTE',
  (state, action) => {
    return action.payload
  },
  'default'
)
export const getSelectedPalette = state => state.selectedPalette
export const getAllPalettes = state => state.palettes

export const getColorPalette = createSelector(
  getSelectedPalette,
  getAllPalettes,
  (id, palettes) => {
    let colors = palettes ? palettes.byId[id] : []
    return {id,colors}
  }
)
export const colorReducers = {
  palettes,
  selectedPalette
}
