const state = {
    // string url
    mainNode: [],
    currentMain: null,

    // { string name, string coinName, string url }
    parallelNode: [],
    currentParallel: null,
}

const mutations = {
    UPDATE_MAIN_NODE(state, payload) {
        state.mainNode = payload;
    },
    UPDATE_CURRENT_MAIN(state, payload) {
        state.currentMain = payload;
    },
    UPDATE_PARALLEL_NODE(state, payload) {
        state.parallelNode = payload
    },
    UPDATE_CURRENT_PARALLEL(state, payload) {
        state.currentParallel = payload
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
