
import Action from 'd2-ui/lib/action/Action';
import { getInstance as getD2 } from 'd2/lib/d2';
const actions = Action.createActionsFromNames(['listComment', 'addComment', 'deleteComment', 'editComment'], 'comment');


actions.listComment
    .subscribe(({ data: [model, id], complete }) => {
        getD2().then(d2 => {
            const url = `interpretations/${id}?fields=comments[id,created,text,user[id,displayName~rename(name)]]`;

            d2.Api.getApi().get(url)
				.then(result => {
    complete(result);
})
.catch(errorResponse => {
    console.log(errorResponse);
				});
        });
    });

actions.addComment
    .subscribe(({ data: [id, value], complete }) => {
        getD2().then(d2 => {
            const url = `interpretations/${id}/comments`;

            d2.Api.getApi().post(url, value, { contentType: 'text/plain' })
				.then(complete)
.catch(errorResponse => {
    console.log(errorResponse);
				});
        });
    });

actions.deleteComment
    .subscribe(({ data: [id, commentId], complete }) => {
        const deleteMessage = confirm('Are you sure you want to delete this comment?');
        if (deleteMessage) {
            getD2().then(d2 => {
                d2.Api.getApi().delete(`interpretations/${id}/comments/${commentId}`)
                    .then(complete)
                    .catch(errorResponse => {
                        console.log(errorResponse);
                    });
            });
        }
    });


actions.editComment
    .subscribe(({ data: [interpretationId, id, value], complete }) => {
        getD2().then(d2 => {
            const url = `${d2.Api.getApi().baseUrl}/interpretations/${interpretationId}/comments/${id}`;

            d2.Api.getApi().request('PUT', url, value, { contentType: 'text/plain' })
				.then(complete)
                .catch(errorResponse => {
                    console.log(errorResponse);
                });
        });
    });


export default actions;
