import React, { useState } from 'react';
import axios from 'axios';
import "../App.css";
import { AiOutlineFile } from 'react-icons/ai';
import { BsFileEarmarkArrowUp } from 'react-icons/bs';
import { MdOutlineFileUpload } from 'react-icons/md';
function FileUpload() {

  const [file, setFile] = useState(null);
  const [show ,setshow]=useState(false);
  const [display ,setdisplay]=useState(false);
  const [analysisResults, setAnalysisResults] = useState({
    top5Words: [],
    top5CoOccurrences: [],
    wordFrequency:[],
  });
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setshow(true);
    console.log(e.target.files[0].size);
    
    if(e.target.files[0].size>5000000||e.target.files[0].type!="text/plain")
    {
          window.alert("upload file within 5 Mb and file type should be .txt ");
          setFile(null);
          setshow(false);
    }
    else if(e.target.files[0].size==0)
    {
      window.alert("file is empty No word found ");
      setFile(null);
      setshow(false);
    }
    else
    {
      window.alert("file uploaded successfully ");
    }
  };

  const handleUpload = async () => {
    console.log("onclickkkkkk");
    console.log(file);
    const formData = new FormData();
    formData.append('textFile', file);
    console.log(formData);
    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
},
      });
      console.log(response.data);
      const  top5Words  = response.data.wordFrequency.top5Words;
      const wordFrequency =response.data.wordFrequency.wordFrequency;
      const top5CoOccurrences =response.data.wordFrequency.top5CoOccurrences;
      console.log(response.data.wordFrequency);
      console.log(top5Words);
      console.log(top5CoOccurrences);
      
      setAnalysisResults({ top5Words, wordFrequency,top5CoOccurrences });
      setdisplay(true);
      setshow(false);

     
      
     
    } catch (error) {
      window.alert("Please upload file to analyze" );
      console.error('Error uploading file:', error);
    }
  };
  
  const [filterKeyword, setFilterKeyword] = useState('');
    
    
    const filteredTopWords = analysisResults.top5Words.filter((word) =>
      word[0].toLowerCase().includes(filterKeyword.toLowerCase())
    );
  
   
    const filteredTopCoOccurrences = analysisResults.top5CoOccurrences.filter((pair) =>
      pair[0].toLowerCase().includes(filterKeyword.toLowerCase())
    );
    const filteredword = analysisResults.wordFrequency.filter((pair) =>
    pair[0].toLowerCase().includes(filterKeyword.toLowerCase())
  );
    

  return (
    <div >
   
    
    <div className="container" >
      <h1>Choose your text file to analyze <AiOutlineFile></AiOutlineFile></h1>
      <br></br>
      <br></br>
      <label for="fileInput" className="file-label">
        <MdOutlineFileUpload></MdOutlineFileUpload>  Choose File
        <input id="fileInput" type="file" onChange={handleFileChange} />
      </label>
      <span>{show&&file.name}</span>
      <button className="submit-button"  onClick={handleUpload}> <BsFileEarmarkArrowUp></BsFileEarmarkArrowUp> Upload and Analyze</button>
    </div>
    {display&&
     <div className='analysis-results'>

<div className="filter">
        <input
          type="text"
          placeholder="Search keywords"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
        />
      </div>
  <div className=''>
    <h2>Top 5 Most Occurring Words</h2>
    <div className='inner-card'>
        {filteredTopWords.map((word, index) => (
        <div key={index} className="card">
            <p><b>Word :</b>{word[0]}</p>
            <p><b>Word-Frequency:</b> {word[1]}</p>
          </div>
        ))}
     </div>
  </div>
   <div className='co-occurence-cards'>
        <h2>Top 5 Most Co-occurring Word Pairs</h2>
        <div className='inner-card'>
        {filteredTopCoOccurrences.map((pair, index) => (
          <div key={index} className="card">
            <p> <b>Word :</b>{pair[0]}</p>
            <p><b>Word-Frequency:</b> {pair[1]}</p>
          </div>
        ))}
        </div>
   </div>
      <div>
        <h2>Word Frequencies</h2>
        <div className='inner-card2'>
        {filteredword.map((pair, index) => (
          <div key={index} className='ic2'>
            <p><b>Word :</b> {pair[0]}</p>
            <p><b>Word-Frequency:</b> {pair[1]}</p>
          </div>
        ))}
        </div>
      </div>
      </div>
      }
    </div>
  );
}

export default FileUpload;