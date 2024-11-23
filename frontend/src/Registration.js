import './Registration.css'; 
import { useState,useEffect } from 'react';
import { compareAsc } from 'date-fns';


function Registration() {
    const [formData, setFormData] = useState({
        username: "",
        gender: "",
        phone: "",
        birthdate: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({}); 
    const [flagRegistration,setFlagRegistration]=useState(false);
    const [message,setMessage]= useState("");
    const [formFlag,setFormFlag]=useState(true);

    useEffect(()=>{
        setTimeout(function(){
            setMessage("")
            setFormFlag(true)
        },10000)
    },[message]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); 
        setErrors({ ...errors, [name]: "" }); 
    };

    const handleSubmit = () => {
        const newErrors = {};

        const phone = formData.phone.replace(/\s+/g, '');

        setFormData({ ...formData, phone: phone });
    
        const { username, gender, birthdate, email, password, confirmPassword } = { ...formData, phone };

        if (!username.trim()) newErrors.username = "Username is required.";

        if(username.trim().length < 2 ) newErrors.username = "Username must be bigger than 2 characters.";

        if(username.trim().length > 20 ) newErrors.username = "Username must have less than 20 characters";
        
        if (!gender) newErrors.gender = "Please select a gender.";
        
        const phoneRegex = /^[0-9]{10}$/; 
        
        if (!phone.trim()) {            
            newErrors.phone = "Phone number is required.";
        } 
        
        else if (!phoneRegex.test(phone)) {
            newErrors.phone = "Phone number must be in the format 123 456 7890.";
        }
        
        if (!birthdate){
            newErrors.birthdate = "Date of birth is required.";
        } 
        else{
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; 
            if (compareAsc(birthdate, formattedDate) > 0) {
                newErrors.birthdate = "The selected date cannot be in the future.";
              } 
            else{
                const selectedBirthdate = new Date(birthdate);
                let age = today.getFullYear() - selectedBirthdate.getFullYear();
                const monthDifference = today.getMonth() - selectedBirthdate.getMonth();
                 const dayDifference = today.getDate() - selectedBirthdate.getDate();
                
                 if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
                    age--; 
                }
                
                if(age < 15){
                    newErrors.birthdate = "You must be at least 15 years old to register."
                }
            }
            
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } 
        
        else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!password.trim()) newErrors.password = "Password is required.";


        if (!confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password.";

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if(password.length < 8){
            newErrors.password = "Password must have size 8 or bigger"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors); 
            return;
        }
        
        var url = "http://localhost:8000/registration.php";

        var headers ={
            "Accept":"application/json",
            "Content-Type":"application/json"
        }
        
        var data = formData;

        fetch(url,{
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then((response)=>response.json())
        .then((response)=>{        
            setMessage(response["answer"]);
            setFlagRegistration(response["result"])
            
            if(response["result"] === true){
                setFormFlag(false)
                setFormData({
                    username: "",
                    gender: "",
                    phone: "",
                    birthdate: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
            }
            

        }).catch((err)=>{
            setErrors(err);
            console.log(err);
        });

        
    };

    return (
        <> 
            {message && (
                <div>
                    <p className={flagRegistration? 'success' : 'error-backend'}>
                        {message}
                    </p>
                </div>
            )}
            {formFlag && (
                <div className="form">
                    
                    <div className="header">Create an account</div>
        
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={errors.username ? "error-input" : ""}
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
        
                    <label>Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={errors.gender ? "error-input" : "selectInput"}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non Binary">Non Binary</option>
                    </select>
                    {errors.gender && <div className="error">{errors.gender}</div>}
        
                    <label>Phone number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., 6934567890"
                        className={errors.phone ? "error-input" : ""}
                    />
                    {errors.phone && <div className="error">{errors.phone}</div>}
        
                    <label>Date of birth</label>
                    <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        className={errors.birthdate ? "error-input" : ""}
                    />
                    {errors.birthdate && <div className="error">{errors.birthdate}</div>}
        
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g., user@example.com"
                        className={errors.email ? "error-input" : ""}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
        
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? "error-input" : ""}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
        
                    <label>Confirm password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? "error-input" : ""}
                    />
                    {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        
                    <button className="button" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            )}
        </>
    );
}

export default Registration;
