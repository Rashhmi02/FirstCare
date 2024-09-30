import React, { useState,useEffect } from 'react';
import { Box, Paper, Grid, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useParams,useNavigate } from 'react-router-dom';



export default function UpdateBranch() {
    const host = "http://127.0.0.1:5000";
    const [branch, setBranch] = useState([]);
    const [branchDetails, setBranchDetails] = useState([]);
    const [fields, setFields] = useState([{ roadmap: '' }]);
    const [chapters, setChapters] = useState([{ title: '', content: '', description: '' }]);
    const [image, setImage] = useState('');
    const [open, setOpen] = useState(false);


    const { id } = useParams();
    const nav = useNavigate();
    const [dbChapter, setDbChapters] = useState([]);

    useEffect(() => {
        axios.get(`${host}/api/admin/getSingleBranch/${id}`)
            .then((res) => {
                console.log(res.data, 'setChapters')
                setBranchDetails(res.data);
                setFields(res.data.roadmap)
                setChapters(res.data.chapters)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    console.log(chapters,66)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
  
        setOpen(false);
    };




    const handleBranchDetails = (e) => {
        setBranchDetails({ ...branchDetails, [e.target.name]: e.target.value });
    }

    console.log(branchDetails, 'coueseDetails')


    const handleAddField = () => {
        setFields([...fields, { roadmap: '' }]);
    };



    const handleRemoveField = (index) => {
        const values = [...fields];
        values.splice(index, 1);
        setFields(values);
    };

    // const handleChange = (index, event) => {
    //     const values = [...fields];
    //     values[index][event.target.name] = event.target.value;
    //     setFields(values);
    // };

    // const handleChange = (index, event) => {
    //     const values = [...fields];
    //     values[index] = event.target.value ;
    //     setFields(values);
    // };

    const handleChange = (index, event) => {
        const values = [...fields];
        values[index] = { ...values[index], roadmap: event.target.value };
        setFields(values);
    };


    console.log(fields, 9090)

    const handleAddChapter = () => {
        setChapters([...chapters, { title: '', content: '', description: '' }]);
    };

    const handleRemoveChapter = (index) => {
        const values = [...chapters];
        values.splice(index, 1);
        setChapters(values);
    };

    const handleChangeChapter = (index, event) => {
        const values = [...chapters];
        // if (event.target.name == 'content') {
        //     values[index][event.target.name] = event.target.files[0];
        // } else {
            values[index][event.target.name] = event.target.value;
        // }
        setChapters(values);
    };
    console.log(chapters)



    const handleImage = (e) => {
        // setImgError(false);
        setImage({ ...image, [e.target.name]: e.target.files[0] });
    };



    console.log(fields, 98)

    const handleSubmit = () => {

        const Data = new FormData();
        Data.append('title', branchDetails.title);
        Data.append('category', branchDetails.category);
        Data.append('level', branchDetails.level);
        Data.append('thumbnail', image.thumbnail);
        Data.append('description', branchDetails.description);
        // fields.forEach((field, index) => {
        //     Data.append('roadmap', field);
        // });
        Data.append('roadmap', JSON.stringify(fields));

        Data.append('chapters', JSON.stringify(chapters));
        // 
        // chapters.map((chapter, index) => {
        //     Data.append(`content`, chapter.content);
        // });

        axios.put(`${host}/api/admin/updatebranch/${id}`, Data)
            .then((res) => {
                if (res.data) {
                    console.log(res.data,'respone')
                    setOpen(true);
                    setTimeout(async()=>{
                        await nav('/admin/manage-branch');
                         
                    },1000)
                } else {
                    console.log("some error occured")
                }

            })
            .catch((err) => {
                console.log(err)
            })

    }

    return (
        <div style={{ height: '100%' }}>
            <Paper>
                <Box sx={{ backgroundColor: '#f0f1f6', padding: '2px 15px' }}>
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert Branch Details</p>
                </Box>

                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined-basic" InputLabelProps={{ shrink: 'none' }} label="Title" name='title' onChange={handleBranchDetails} value={branchDetails.title} variant="outlined" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined-basic" InputLabelProps={{ shrink: 'none' }} label="Category" name='category' onChange={handleBranchDetails} value={branchDetails.category} variant="outlined" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined-basic" InputLabelProps={{ shrink: 'none' }} label="Level" name='level' onChange={handleBranchDetails} value={branchDetails.level} variant="outlined" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField type='file' InputLabelProps={{ shrink: 'none' }} name='thumbnail' onChange={handleImage} id="outlined-basic"  label="Upload Thumbnail" variant="outlined" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="outlined-basic" label="Description" InputLabelProps={{ shrink: 'none' }} name='description' onChange={handleBranchDetails} value={branchDetails.description} variant="outlined" size="small" multiline rows={2} fullWidth />
                    </Grid>

                    {fields.map((field, index) => (
                        <Grid item xs={12} md={8} key={index}>
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <TextField
                                    id="outlined-basic"
                                    label={`Roadmap ${index + 1}`}
                                    variant="outlined"
                                    size="small"
                                    name="roadmap"
                                    value={field.roadmap}
                                    onChange={event => handleChange(index, event)}
                                    fullWidth
                                    InputLabelProps={{ shrink: 'none' }}
                                />
                                {index > 0 && (
                                    <IconButton
                                        aria-label="remove"
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleRemoveField(index)}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Grid>
                    ))}
                    <Grid item xs={12} md={8}>
                        <Button aria-label="add" variant="outlined" size="small" onClick={handleAddField}>
                            <AddIcon />
                            Add Field
                        </Button>
                    </Grid>


                </Grid>
                <Box sx={{ backgroundColor: '#f0f1f6', padding: '2px 15px' }}>
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert Chapter Details</p>
                </Box>

                


                <Box sx={{ p: 2 }}>
                    {chapters.map((chapter, index) => (
                        <Box >
                            <Box key={index} sx={{ backgroundColor: '#f3f3f5', mt: 2, p: 2, borderRadius: '5px' }}>
                                <Grid container spacing={2} >
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Title"
                                            variant="outlined"
                                            size="small"
                                            name="title"
                                            value={chapter.title}
                                            onChange={event => handleChangeChapter(index, event)}
                                            fullWidth
                                            InputLabelProps={{ shrink: 'none' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            // type="file"
                                            // InputLabelProps={{ shrink: true }}
                                            id="outlined-basic"
                                            label="Upload Content (*Link)"
                                            variant="outlined"
                                            size="small"
                                            name="content"
                                            value={chapter.content}
                                            onChange={event => handleChangeChapter(index, event)}
                                            fullWidth
                                            InputLabelProps={{ shrink: 'none' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Description"
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={2}
                                            name="description"
                                            value={chapter.description}
                                            onChange={event => handleChangeChapter(index, event)}
                                            fullWidth
                                            InputLabelProps={{ shrink: 'none' }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {index > 0 && (
                                            <IconButton
                                                aria-label="remove"
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleRemoveChapter(index)}

                                            >
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        )}
                                    </Grid>

                                </Grid>

                            </Box>


                        </Box>
                    ))}

                    <Grid item xs={12} sx={{ p: 1 }}>
                        <Button aria-label="add" variant="outlined" size="small" onClick={handleAddChapter}>
                            <AddIcon />
                            Add Chapter
                        </Button>
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 3, width: '400px', }}>
                        <Button variant='contained' color='primary' fullWidth onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Box>
            </Paper>



            <Snackbar
                open={open}
                autoHideDuration={4000} // Set auto hide duration to 4000 milliseconds (4 seconds)
                onClose={handleClose} // Call handleClose2 when Snackbar should close
                anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position the Snackbar at the top right
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Branch Inserted!
                </Alert>
            </Snackbar>
        </div>
    );
}
