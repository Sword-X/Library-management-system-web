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
        logout: '/api/lms/user/logout',
        // 根据用户查询角色
        getRoleListByUserId: '/api/lms/user/getRoleListByUserId',
        // 根据用户分配角色
        saveAssignRole: '/api/lms/user/saveAssignRole'
    },
    // 角色管理
    role: {
        // 分页
        getPage: '/api/lms/role/getPage',
        // 新增
        save: '/api/lms/role/save',
        // 删除
        delete: '/api/lms/role/delete',
        // 根据角色查询菜单
        getMenuListByRoleId: '/api/lms/role/getMenuListByRoleId',
        // 根据角色分配菜单
        saveAssignMenu: '/api/lms/role/saveAssignMenu'
    },
    // 菜单管理
    menu: {
        // 分页
        getPage: '/api/lms/menu/getPage',
        // 新增
        save: '/api/lms/menu/save',
        // 删除
        delete: '/api/lms/menu/delete',
    }

}

export default ApiConst;