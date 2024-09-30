import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';



const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: '10px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    maxHeight: '500px',
    overflowY: 'auto',
    //   border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};




export default function ViewChapters() {
    const host = "http://127.0.0.1:5000";
    const { id } = useParams();
    const [chapter, setChapters] = useState([]);

    useEffect(() => {
        axios.get(`${host}/api/admin/getSingleCourse/${id}`)
            .then((res) => {
                console.log(res.data.chapters, 'setChapters')
                setChapters(res.data.chapters);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])




    return (
        <div style={{ height: '100vh' }}>


            <Paper sx={{ padding: '20px 20px 20px 20px', borderRadius: '10px' }}>
                <Typography variant='h6' sx={{ mb: 2, color: 'gray', fontWeight: '500' }}>View Chapters in Detail</Typography>
              
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {chapter.map((item) => (
                        <Box sx={{ borderRadius: '10px', p: 2, display: 'flex', gap: '10px', alignItems: 'center', boxShadow: '0 0 2px grey' }}>
                            <Box>
                                <h4>{item.title}</h4>
                                <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    <p>{item.description}</p>
                                </Box>
                            </Box>
                            <div style={{ maxWidth: '100%', height: 'auto' }}>
                                <iframe
                                    width="400"
                                    height="215"
                                    src={`https://www.youtube.com/embed/${item.content}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="YouTube Video"
                                    style={{ borderRadius: '10px' }}

                                ></iframe>
                            </div>
                        </Box>
                ))}


                    </Box>

            </Paper>
        </div>
    );
}
