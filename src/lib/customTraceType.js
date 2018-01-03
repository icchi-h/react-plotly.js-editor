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
  } else if (!trace.type) {
    return 'line';
  }
  return trace.type;
}

export function customTraceToPlotlyTrace(customTraceType, container) {
  if (customTraceType === 'line' && container.mode) {
    return {type: 'scatter', mode: 'lines', fill: 'none'};
  }

  if (customTraceType === 'line' && !container.mode) {
    return {type: 'scatter', mode: 'lines+markers', fill: 'none'};
  }

  if (customTraceType === 'scatter') {
    return {type: 'scatter', mode: 'markers', fill: 'none'};
  }

  if (customTraceType === 'area') {
    return {type: 'scatter', fill: 'tozeroy'};
  }

  return {type: customTraceType};
}
