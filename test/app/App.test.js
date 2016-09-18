import React from 'react';
import { shallow } from 'enzyme';
import log from 'loglevel';

import App from '../../src/app/App';
import HeaderBar from 'd2-ui/lib/app-header/HeaderBar';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

describe('App', () => {
    let appComponent;

    beforeEach(() => {
        appComponent = shallow(<App />);
    });

    it('should render the startup text', () => {
        expect(appComponent.find('.main-content').text()).to.equal('Hello, John! Your app skeleton set up correctly!');
    });

    it('should render the custom name if it is passed', () => {
        appComponent = shallow(<App name="Mark" />);

        expect(appComponent.find('.main-content').text()).to.equal('Hello, Mark! Your app skeleton set up correctly!');
    });

    xit('should render the HeaderBar component from d2-ui', () => {
        expect(appComponent.find(HeaderBar)).to.have.length(1);
    });

    it('should render the Sidebar component from d2-ui', () => {
        expect(appComponent.find(Sidebar)).to.have.length(1);
    });

    it('should pass two sections to the Sidebar component', () => {
        const sidebarComponent = appComponent.find(Sidebar);

        expect(sidebarComponent.props().sections).to.have.length(2);
    });

    it('should pass the key and label properties for the sections', () => {
        const sidebarComponent = appComponent.find(Sidebar);
        const sidebarSections = sidebarComponent.props().sections;

        expect(sidebarSections).to.deep.equal([
            { key: 'item1', label: 'Item 1' },
            { key: 'item2', label: 'Item 2' },
        ]);
    });

    it('should log to console when a sidebar onChangeSection is called', () => {
        spy(log, 'info');

        const sidebarComponent = appComponent.find(Sidebar);
        sidebarComponent.props().onChangeSection('item1');

        expect(log.info).to.be.calledWith('Clicked on ', 'item1');
    });
});
