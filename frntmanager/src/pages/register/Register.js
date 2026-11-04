import React, { useState } from 'react'
import { Button, Form, FormControl } from 'react-bootstrap'
import "./Register.css"
import { useNavigate } from 'react-router-dom'

function Register() {

    const[formData, setFormData] = useState({
        usename:"",
        password:""
    })

    const handleInputChange = (event) =>{
        const {name,value} = event.target;
        setFormData({
            ...formData,
            [name]:value
        })
}

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
                const response = await fetch("http://localhost:8080/api/v1/auth/register",{
                    method: "POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify(formData)        
                });
                const data = await response.json;

                if(!response.ok){
                    alert(data.message || "ERRO NO REGISTO");
                    return;
                }

                console.log("Registo concluído:", data);
                navigate("/login")

            }   catch(error){
                console.log("ERROR", error.message);
        }
    }

    return(
        <>
            <div className='center-form'>
                <h1> Registo de cliente</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='formBasicName'>
                        <FormControl
                            type="text"
                            name="username"
                            placeholder='Enter username'
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId='formBasicName'>
                        <FormControl
                            type="password"
                            name="password"
                            placeholder='Enter password'
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Button variant='primary' type="submit" className='w-100'>Finalizar registo</Button>
                </Form>
            </div>
        </>
    )

}
export default Register