import React,{useState,useEffect} from 'react'
import axios from "axios"

const Home = () => {
    const [data,setData] = useState({
        FirstName:"",
        LastName:"",
        Email:"",
        Department:""
    })
    const [usersData,setUsersData] = useState([])
    const [editingUserId,setEditingUserId] = useState(null)


    const onChangeHandler= (e) =>{
        setData({...data,[e.target.name] :e.target.value})
        console.log(data)
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        console.log("Data being sent",data)
        

        try{

            if(editingUserId){
                const response = await axios.put(`https://user-dashboard-management-backend.onrender.com/updateUser/${editingUserId}`,data,{
                    headers:{
                        "Content-Type":"application/json",
                    }
                });
                console.log("User Updated Successfully", response.data)
                alert('user details updated Successfully')
                fetchUsers()
                setData({
                    FirstName: "",
                    LastName: "",
                    Email: "",
                    Department: ""
                });
                setEditingUserId(null)

            }else{
                let response = await axios.post("https://user-dashboard-management-backend.onrender.com/addUser",data,{
                    headers: {
                      "Content-Type": "application/json",
                    }})
                localStorage.setItem("user added Successfully",JSON.stringify(response.data))
                alert('User Add Successfully')
                setData({
                    FirstName: "",
                    LastName: "",
                    Email: "",
                    Department: ""
                });
                setEditingUserId(null)
                fetchUsers()
                

            }
            
        }catch(err){
            console.log(err)
        }
    }

    const fetchUsers= async()=>{
        axios.get("https://user-dashboard-management-backend.onrender.com/users",{
            headers:{
                "Content-Type": "application/json",
              }
        })
        .then((res)=>{
            setUsersData(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })

    }
    
    const onClickDeleteUser = async(id) =>{

        try{
            await axios.delete(`https://user-dashboard-management-backend.onrender.com/deleteUser/${id}`)
            alert("User deleted successfully")
            fetchUsers();
        }catch(err){
            console.log(err)
        }
    }

    const editHandler = async(eachUser)=>{
        setData({
            FirstName:eachUser.FirstName,
            LastName:eachUser.LastName,
            Email:eachUser.Email,
            Department:eachUser.Department
        })
        setEditingUserId(eachUser._id)
    }

useEffect(()=>{
    fetchUsers()
},[])

    // console.table(usersData)
  return (
    <div className='bg-container'>
    <div className='bg-Home'>
        <h2>User Management Dashboard</h2>
        <div className='userDetails'> 
            {usersData.map((eachUser,index)=>(
                <div key={index} className='eachUserDetailsCard'>
                    <div className='eachUserDetails'>
                    <p><strong>user id:</strong> {eachUser._id}</p>
                    <p><strong>Full Name:</strong> {eachUser.FirstName} {eachUser.LastName}</p>
                    <p><strong>Email:</strong> {eachUser.Email}</p>
                    <p><strong>Deparment:</strong> {eachUser.Department}</p>
                    </div>
                    
                    <div className='editAndDeleteBtns'>
                        <button onClick={()=>editHandler(eachUser)}>Edit</button>
                        <button onClick={()=>onClickDeleteUser(eachUser._id)}>delete</button>
                    </div>

                </div>
            ))}
        </div>
    </div>
    <div className='formContainer'>
        <h1>Add User or Edit user Details</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input type="text" value={data.FirstName} name="FirstName" placeholder='Enter your First Name' onChange={onChangeHandler} required/>
            </div>
            <div>
                <label>Last Name</label>
                <input type="text" value={data.LastName} name="LastName" placeholder='Enter your Last Name' onChange={onChangeHandler} required/>
            </div>
            <div>
                <label>Email</label>
                <input type="email" value={data.Email} name="Email" placeholder='Enter your Email' onChange={onChangeHandler} required/>
            </div>
            <div>
                <label>Department</label>
                <input type="text" value ={data.Department} name="Department" placeholder='Enter your department' onChange={onChangeHandler} required/>
            </div>
            <div>
                <button type="Submit">{editingUserId ? "Edit user" : "Add user"}</button>
            </div>
        </form>
    </div>
    </div>
  )
}

export default Home
