userInfoPage()

function userInfoPage() {

    fetch('http://localhost:8080/api/users' + '/authUser').then(response => response.json())
        .then(authUser => {
            document.getElementById('Navbar').textContent = `${authUser.username} with roles:
            ${authUser.authorities.map(a => a.role).map(name => name.replace("ROLE_", ""))}`
            document.getElementById("userInfoPage").innerHTML = `
                <tr>
                    <td>${authUser.firstName}</td>
                    <td>${authUser.lastName}</td>
                    <td>${authUser.email}</td>
                    <td>${authUser.roles.map(r => " " + r.role).map(name => name.replace("ROLE_", ""))}</td>
                </tr>`
        })

}