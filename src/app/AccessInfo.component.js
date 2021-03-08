import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import React from 'react'

const AccessInfo = createReactClass({
    propTypes: {
        data: PropTypes.object,
    },

    _convertSharingCodeToName(sharingCode) {
        let sharingName = 'Read'
        if (sharingCode === 'r-------') {
            sharingName = 'Read'
        } else if (sharingCode === 'rw------') {
            sharingName = 'Read/Write'
        } else if (sharingCode === '--------') {
            sharingName = 'None'
        }

        return sharingName
    },

    _convertExternalAccessText(externalAccess) {
        let text = ''
        if (externalAccess) {
            text = 'Yes'
        } else if (!externalAccess) {
            text = 'No'
        }

        return text
    },

    render() {
        return (
            <table className="accessDiv">
                <tr>
                    <td>
                        <table className="tblMainPage accessTb">
                            <tr>
                                <th colSpan="2">Intepretation Sharing</th>
                            </tr>
                            <tr>
                                <td className="bold">Owner</td>
                                <td>{this.props.data.user}</td>
                            </tr>
                            <tr>
                                <td className="bold">Public Access</td>
                                <td>
                                    {this._convertSharingCodeToName(
                                        this.props.data.publicAccess
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="bold">External Access</td>
                                <td>
                                    {this._convertExternalAccessText(
                                        this.props.data.externalAccess
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    colSpan="2"
                                    className="bold accessSubHeader"
                                >
                                    User Group Sharing
                                </td>
                            </tr>
                            {this.props.data.userGroupAccesses.map(
                                userGroupAccess => (
                                    <tr
                                        key={`${
                                            userGroupAccess.displayName
                                        }-${this._convertSharingCodeToName(
                                            userGroupAccess.access
                                        )}`}
                                    >
                                        <td className="bold accessUser">
                                            {userGroupAccess.displayName}
                                        </td>
                                        <td>
                                            {this._convertSharingCodeToName(
                                                userGroupAccess.access
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </table>
                    </td>
                    <td>
                        <table className="tblMainPage accessTb">
                            <tr>
                                <th colSpan="2">Favorite Sharing</th>
                            </tr>
                            <tr>
                                <td className="bold">Owner</td>
                                <td>{this.props.data.objData.user.name}</td>
                            </tr>
                            <tr>
                                <td className="bold">Public Access</td>
                                <td>
                                    {this._convertSharingCodeToName(
                                        this.props.data.objData.publicAccess
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="bold">External Access</td>
                                <td>
                                    {this._convertExternalAccessText(
                                        this.props.data.objData.externalAccess
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    colSpan="2"
                                    className="bold accessSubHeader"
                                >
                                    User Group Sharing
                                </td>
                            </tr>
                            {this.props.data.objData.userGroupAccesses.map(
                                userGroupAccess => (
                                    <tr
                                        key={`${
                                            userGroupAccess.displayName
                                        }-${this._convertSharingCodeToName(
                                            userGroupAccess.access
                                        )}`}
                                    >
                                        <td className="bold accessUser">
                                            {userGroupAccess.displayName}
                                        </td>
                                        <td>
                                            {this._convertSharingCodeToName(
                                                userGroupAccess.access
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </table>
                    </td>
                </tr>
            </table>
        )
    },
})

export default AccessInfo
