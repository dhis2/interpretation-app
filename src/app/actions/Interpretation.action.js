
import React from 'react';
import Action from 'd2-ui/lib/action/Action';
import { getInstance as getD2 } from 'd2/lib/d2';

const actions = Action.createActionsFromNames(['updateModel'], 'interpretation');


actions.updateModel.subscribe(({ data: [modelToEdit, id, value] }) => {
	
	getD2().then(d2 => {
		
		
		d2.Api.getApi().post('interpretations/' + id + "/like", {} )
			.then(message => {
				console.log( 'success : ' + message );
				
			})
			.catch(errorResponse => {
				console.log( 'error : ' + errorResponse );
			});
			
	});
	
	
});

export default actions;

