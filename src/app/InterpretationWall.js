import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { dataInfo } from './data'
import InterpretationList from './InterpretationList.component'
import SearchBox from './SearchBox.component'
import TopRankItems from './TopRankItems.component'

const isSuperUser = d2 => d2.currentUser.authorities.has('ALL')
const rightAreaWidth = `${dataInfo.rightAreaWidth}px`

const InterpretationWall = ({ d2 }) => {
    const listRef = useRef(null)
    const handleSearchChange = searchTerm => {
        listRef.current.onSearchChanged(searchTerm)
    }
    const handleTopRankItemClick = searchTerm => {
        listRef.current.onSearchChanged(searchTerm)
    }
    const currentUser = {
        name: d2.currentUser.displayName,
        id: d2.currentUser.id,
        superUser: isSuperUser(d2),
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <SearchBox onChangeEvent={handleSearchChange} />
                        <InterpretationList d2={d2} ref={listRef} />
                    </td>
                    <td>
                        <div
                            style={{
                                width: rightAreaWidth,
                                minHeight: '500px',
                            }}
                        >
                            <TopRankItems
                                currentUser={currentUser}
                                onTopRankItemClicked={handleTopRankItemClick}
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

InterpretationWall.propTypes = {
    d2: PropTypes.object,
}

export default InterpretationWall
