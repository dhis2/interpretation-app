
import Action from 'd2-ui/lib/action/Action';
import { getInstance as getD2 } from 'd2/lib/d2';

const actions = Action.createActionsFromNames(['listInterpretation', 'getMap', 'getEventReport', 'updateLike', 'removeLike', 'deleteInterpretation', 'editInterpretation'], 'interpretation');


// TODO: Does not have fail response, or always response!!!
actions.listInterpretation
.subscribe(({ data: [model, searchData, page], complete, error }) => {
    getD2().then(d2 => {
        let url = `interpretations?fields=id,type,text,created,likes,likedBy[id,name],user[id,name],comments[id,created,text,user[id,name]],eventReport[id,name,relativePeriods],eventChart[id,name,relativePeriods],chart[id,name,relativePeriods],map[id,name,mapViews[relativePeriods]],reportTable[id,name,relativePeriods]${searchData}`;
        if (page !== undefined) {
            url += `&page=${page}&pageSize=10`;
        } else {
            url += '&paging=false';
        }

        d2.Api.getApi().get(url)
        .then(result => {
            complete(result);
        })
        .catch(error);
    });
});

actions.getMap
.subscribe(({ data: [model, mapId], complete }) => {
    getD2().then(d2 => {
        const url = `/25/maps/${mapId}.json?fields=mapViews[*,columns[dimension,filter,items[dimensionItem|rename(id),dimensionItemType,displayName|rename(name)]],rows[dimension,filter,items[dimensionItem|rename(id),dimensionItemType,displayName|rename(name)]],filters[dimension,filter,items[dimensionItem|rename(id),dimensionItemType,displayName|rename(name)]],dataDimensionItems,program[id,displayName|rename(name)],programStage[id,displayName|rename(name)],legendSet[id,displayName|rename(name)],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]`;

        d2.Api.getApi().get(url)
        .then(complete)
        .catch(errorResponse => {
            console.log(errorResponse);
        });
    });
});

actions.getEventReport
.subscribe(({ data: [model, reportId], complete }) => {
    getD2().then(d2 => {
        const url = `/eventReports/${reportId}.json?fields=*,program[id,name],programStage[id,name],columns[dimension,filter,legendSet[id,name],items[id,name]],rows[dimension,filter,legendSet[id,name],items[id,name]],filters[dimension,filter,legendSet[id,name],items[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits`;

        d2.Api.getApi().get(url)
        .then(complete)
        .catch(errorResponse => {
            console.log(errorResponse);
        });
    });
});

actions.deleteInterpretation
    .subscribe(({ data: [model, id], complete }) => {
        const deleteMessage = confirm('Are you sure you want to delete this interpretation?');
        if (deleteMessage) {
            getD2().then(d2 => {
                d2.Api.getApi().delete(`interpretations/${id}`)
                    .then(complete)
                    .catch(complete);
            });
        }
    });

actions.updateLike.subscribe(({ data: [model, id], complete }) => {
    getD2().then(d2 => {
        d2.Api.getApi().post(`interpretations/${id}/like`)
			.then(complete)
			.catch(errorResponse => {
    console.log(errorResponse);
			});
    });
});

actions.removeLike.subscribe(({ data: [model, id], complete }) => {
    getD2().then(d2 => {
        d2.Api.getApi().delete(`interpretations/${id}/like`)
			.then(complete)
			.catch(errorResponse => {
    console.log(errorResponse);
			});
    });
});

actions.editInterpretation
    .subscribe(({ data: [model, id, value], complete }) => {
        getD2().then(d2 => {
            const url = `${d2.Api.getApi().baseUrl}/interpretations/${id}`;

            d2.Api.getApi().request('PUT', url, value, { contentType: 'text/plain' })
				.then(complete)
                .catch(errorResponse => {
                    console.log(errorResponse);
                });
        });
    });

export default actions;
