const ApiConst = {
    // 用户管理
    user: {
        // 分页查询
        getPage: '/api/lms/user/getPage',
        // 用户新增
        save: '/api/lms/user/save',
        // 用户删除
        delete: '/api/lms/user/delete',
        // 用户登录
        login: '/api/lms/user/login',
        // 用户退出
        logout: '/api/lms/user/logout'
    },
    // 角色管理
    role: {
        // 分页
        getPage: '/api/lms/role/getPage',
        // 新增
        save: '/api/lms/role/save',
        // 删除
        delete: '/api/lms/role/delete',
    }

}

export default ApiConst;