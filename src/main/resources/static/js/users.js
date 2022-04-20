getAllUsers()
userInfoPage()
roleAdd()

async function roleAdd() {
    let rolesAddList = ''
    await fetch('http://localhost:8080/api/roles').then(response => response.json())
        .then(roles => roles.forEach(role => {
            rolesAddList += `
 <option value="${role.role}"">${role.role.replace("ROLE_", "")}</option>`
        }))
    document.getElementById('roleAdd').innerHTML = rolesAddList
}

$(document).ready(function () {
    $('#editUser').on('hidden.bs.modal', function () {
        $(':input', this).val('');
    });
    $('#deleteUser').on('hidden.bs.modal', function () {
        $(':input', this).val('');
    });
});

async function getAllUsers() {
    let usersList = ''

    await fetch('http://localhost:8080/api/users').then(response => response.json())
        .then(users => users.forEach(user => {
            usersList += `
            <tr id = "rowUser${user.id}">
                        <td id="rowFirstName${user.id}">${user.firstName}</td>
                              <td id="rowLastName${user.id}">${user.lastName}</td>
                              <td id="rowEmail${user.id}">${user.email}</td>
                              <td id="rowRoles${user.id}">${user.roles.map(r => " " + r.role)
                .map(name => name.replace("ROLE_", ""))}</td>
                              <td><a class="btn btn-info" data-toggle="modal" id="${user.id}"
                               onclick="editModal(${user.id})" href="#editUser">Edit</a></td>
                              <td><a class="btn btn-danger" data-toggle="modal" id="${user.id}"
                              onclick="deleteModal(${user.id})" href="#deleteUser">Delete</a></td>
                           </tr>`
        }))
    document.getElementById('usersTBody').innerHTML = usersList
}

function userInfoPage() {

    fetch('http://localhost:8080/api/users' + '/authUser')
        .then(response => response.json())
        .then(authUser => {
            document.getElementById('Navbar').textContent = `${authUser.username} with roles:
            ${authUser.authorities.map(a => a.role).map(name => name.replace("ROLE_", ""))}`
            document.getElementById('userInfoPage').innerHTML = `
                <tr>
                    <td>${authUser.firstName}</td>
                    <td>${authUser.lastName}</td>
                    <td>${authUser.email}</td>
                    <td>${authUser.roles.map(r => " " + r.role).map(name => name.replace("ROLE_", ""))}</td>
                </tr>`
        })
}

async function addUser() {

    console.log('add user')
    let user =
        {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            roles: []
        }

    let roleName = document.getElementById('roleAdd').getElementsByTagName('option')
    for (let i = 0; i < roleName.length; i++) {
        if (roleName[i].selected) {
            await fetch('http://localhost:8080/api/roles' + '/' + roleName[i].value).then(response => response.json())
                .then(role => user.roles.push(role))
        }
    }

    await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    getAllUsers()
    $('#usersTableButton').click();

}

async function editUser(id) {
    console.log('edit user')
    let user =
        {
            id: document.getElementById('idEdit').value,
            firstName: document.getElementById('firstNameEdit').value,
            lastName: document.getElementById('lastNameEdit').value,
            email: document.getElementById('emailEdit').value,
            password: document.getElementById('passwordEdit').value,
            roles: []
        }
    let roleName = document.getElementById('roleEdit').getElementsByTagName('option')
    for (let i = 0; i < roleName.length; i++) {
        if (roleName[i].selected) {
            await fetch('http://localhost:8080/api/roles' + '/' + roleName[i].value).then(response => response.json())
                .then(role => user.roles.push(role))
        }
    }

    await fetch('http://localhost:8080/api/users', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    $('#editUser').modal('hide');

    await fetch('http://localhost:8080/api/users' + '/' + id).then(response => response.json())
        .then(user => {
            document.getElementById('rowFirstName' + id).textContent = user.firstName
            document.getElementById('rowLastName' + id).textContent = user.lastName
            document.getElementById('rowEmail' + id).textContent = user.email
            document.getElementById('rowRoles' + id).textContent = user.roles.map(r => " " + r.role)
                .map(name => name.replace("ROLE_", ""))
        })
}

async function deleteUser(id) {
    console.log('delete user')
    await fetch('http://localhost:8080/api/users' + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(id)
    });
    $('#deleteUser').modal('hide');
    await document.getElementById('rowUser' + id).remove()
}

function editModal(id) {
    let rolesList = ''

    fetch('http://localhost:8080/api/users' + '/' + id).then(response => response.json())
        .then(async user => {
            document.getElementById('idEdit').value = user.id
            document.getElementById('firstNameEdit').value = user.firstName
            document.getElementById('lastNameEdit').value = user.lastName
            document.getElementById('emailEdit').value = user.email
            await fetch('http://localhost:8080/api/roles').then(response => response.json())
                .then(roles => roles.forEach(role => {
                    rolesList += `
                        <option value="${role.role}">${role.role.replace("ROLE_", "")}</option>`
                }))
            document.getElementById('roleEdit').innerHTML = rolesList
            document.getElementById('modalEditButton').addEventListener('click', () => editUser(user.id))
        })
}

function deleteModal(id) {
    fetch('http://localhost:8080/api/users' + '/' + id).then(response => response.json())
        .then(user => {
            document.getElementById('idDelete').value = user.id
            document.getElementById('firstNameDelete').value = user.firstName
            document.getElementById('lastNameDelete').value = user.lastName
            document.getElementById('emailDelete').value = user.email
            document.getElementById('modalDeleteButton').addEventListener('click', () => deleteUser(user.id))
        })
}