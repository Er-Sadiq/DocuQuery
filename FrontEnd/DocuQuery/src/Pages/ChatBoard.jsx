import React, { useState, useEffect } from 'react';

function ChatBoard() {
  const [pdfExtract, setPdfExtract] = useState('');
  const [inputText, setInputText] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle question submission
  const handleSendQuestion = async () => {
    if (inputText.trim() === '') return;
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputText }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatResponse(data.answer || "No answer received.");
      } else {
        alert("Failed to get a response. Please try again.");
      }
    } catch (error) {
      console.error("Error sending question:", error);
      alert("An error occurred while sending the question.");
    } finally {
      setIsLoading(false);
      setInputText(''); // Clear the input after sending
    }
  };

  // Fetch the PDF extract on component mount
  useEffect(() => {
    const fetchPdfExtract = async () => {
      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setPdfExtract(data.extract || "No PDF content available.");
        } else {
          alert("Failed to load PDF content.");
        }
      } catch (error) {
        console.error("Error fetching PDF extract:", error);
        alert("An error occurred while fetching PDF content.");
      }
    };

    fetchPdfExtract();
  }, []);

  return (
    <div className='bg-slate-100 w-screen h-screen overflow-hidden'>
      <nav className='bg-slate-200 py-4 flex items-center'>
        <h1 className='text-2xl mx-10'>AI Planet</h1>
        <h2 className='text-xl text-green-500 mx-2 ml-auto'>demo.pdf</h2>
        <button className='px-2 py-2 bg-slate-400 rounded-xl mr-4'>Back</button>
      </nav>

      <div className='w-screen min-h-screen flex flex-col items-center p-4'>
        <div className='bg-white w-11/12 p-4 rounded-lg shadow-lg'>
          <h2 className='text-lg font-semibold mb-2'>PDF Content:</h2>
          <p className='text-sm text-gray-600'>{pdfExtract}</p>
        </div>

        <div className='w-full flex flex-col items-center mt-8'>
          <div className='flex w-9/12 bg-slate-200 rounded-2xl p-4'>
            <input
              className='flex-1 h-10 rounded-xl border-2 border-gray-400 p-2'
              placeholder="Type your question here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendQuestion()}
              disabled={isLoading}
            />
            <button
              className={`ml-4 px-4 py-2 bg-green-500 text-white rounded-xl ${isLoading ? 'bg-gray-400' : ''}`}
              onClick={handleSendQuestion}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>

          <div className='w-9/12 bg-slate-200 rounded-2xl p-4 mt-4'>
            <h3 className='text-lg font-semibold mb-2'>Response:</h3>
            <p className='text-sm text-gray-700'>{chatResponse || "Your response will appear here."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBoard;
