import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import $ from 'jquery'
import { MuiThemeProvider } from 'material-ui/styles'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import React from 'react'
import InterpretationWall from './app/InterpretationWall'

window.$ = $
window._appUse = 'integrated'

import './reporttable'
import './chart'
import './map'
import './eventchart'
import './eventreport'

const App = () => {
    const { d2 } = useD2()

    if (!d2) {
        return null
    }

    return (
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <InterpretationWall d2={d2} />
        </MuiThemeProvider>
    )
}

export default App
