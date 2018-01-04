export function plotlyTraceToCustomTrace(trace) {
  if (
    trace.type === 'scatter' &&
    trace.fill &&
    ['tozeroy', 'tozerox', 'tonexty', 'tonextx', 'toself', 'tonext'].includes(
      trace.fill
    )
  ) {
    return 'area';
  } else if (
    trace.type === 'scatter' &&
    (!trace.mode || trace.mode === 'lines' || trace.mode === 'lines+markers')
  ) {
    return 'line';
  }
  return trace.type;
}

export function customTraceToPlotlyTrace(customTraceType, container) {
  // we don't want to set a mode until there is data in the plot,
  // in this case TraceSelector's componentWillReceiveProps will set the mode to
  // the plotly.js default mode, we don't want to override this here, this is why
  // we always check for container.mode in our conditionals

  if (customTraceType === 'line' && container.mode === 'markers') {
    return {type: 'scatter', mode: 'lines', fill: 'none'};
  }

  if (customTraceType === 'line' && container.mode) {
    return {type: 'scatter', mode: container.mode, fill: 'none'};
  }

  if (customTraceType === 'scatter' && container.mode) {
    return {type: 'scatter', mode: 'markers', fill: 'none'};
  }

  if (customTraceType === 'area' && container.mode) {
    return {type: 'scatter', fill: 'tozeroy'};
  }

  return {type: customTraceType};
}
