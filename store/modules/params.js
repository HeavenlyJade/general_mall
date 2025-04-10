var defaultParams={
	"pagetype":"",   

}

const state =Object.assign({},defaultParams)
const mutations = {
  update: (state, d) => {
	let tmp = Object.assign(state,d)
	state = tmp
  }
}

const actions = {
		update({ commit,dispatch,state},d){
			commit("update",d)
			return new Promise((resolve,reject)=>{
				resolve(state)
			})
		},

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}