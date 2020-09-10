export const getActiveOwner = state => {
    if(!state.active.owner) return null;
    return state.active.owner;
};
export const getActivePolicy = state => {
    if(!state.active.policy) return "";
    return state.active.policy.current ? state.active.policy.policy : state.active.policy.date;
};

export const getOwners = state => {
    return state.owners;
};
export const getHistory = state => {
    return state.history;
};