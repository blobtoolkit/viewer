import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import { getMainPlot } from './plot';
import { getFilteredDataForFieldId } from './preview'
import store from '../store'

export const getMainPlotData = (state) => {
//  return function(dispatch){
//let state = store.getState()
    let mainPlot = getMainPlot(state);
    let plotData = {id:mainPlot.id,axes:{}};
    console.log(mainPlot)
    plotData.axes.x = getFilteredDataForFieldId(state,mainPlot.axes.x);
    plotData.axes.y = getFilteredDataForFieldId(state,mainPlot.axes.y);
    plotData.axes.z = getFilteredDataForFieldId(state,mainPlot.axes.z);
    plotData.axes.cat = getFilteredDataForFieldId(state,mainPlot.axes.cat);
    return plotData;
//  }
}
