import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./emoji.css";
import { useNavigate } from "react-router-dom"; 
import axiosInstance from "../../../axiosInstance";

const emojiList = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😌", label: "Relaxed" },
  { emoji: "😖", label: "Stressed" },
  { emoji: "😢", label: "Crying" },
  { emoji: "😍", label: "Loving" },
  { emoji: "😨", label: "Fear" },
  { emoji: "😣", label: "Disgust" },
  { emoji: "😮", label: "Surprise" }
];

const EmojiCarousel = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get today's date as a string
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("emojiDate");
    const storedEmoji = localStorage.getItem("selectedEmoji");
    const storedSuggestion = localStorage.getItem("suggestion");
  
    // If the date in localStorage is different from today, clear the previous day's data
    if (storedDate !== today) {
      localStorage.removeItem("selectedEmoji");
      localStorage.removeItem("suggestion");
      localStorage.setItem("emojiDate", today); 
    } else if (storedEmoji) {
      setSelectedEmoji(storedEmoji);
      setSuggestion(storedSuggestion || "Remember, it's okay to feel this way!");
    }
  
    const fetchSelectedEmoji = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const response = await axiosInstance.get(`/emotion/today/${userInfo.id}`);
        const data = response.data;
  
        if (data.emoji) {
          setSelectedEmoji(data.emoji);
          setSuggestion(data.suggestion);
          localStorage.setItem("selectedEmoji", data.emoji);
          localStorage.setItem("suggestion", data.suggestion);
          localStorage.setItem("emojiDate", today); // Store the current date
        }
      } catch (error) {
        console.error('Error occurred while fetching emoji:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSelectedEmoji();
  }, []);  
  
  const handleEmojiSelect = async (emoji) => {
    if (selectedEmoji) {
      alert("You have already selected an emoji for today. Please try again tomorrow!");
      return;
    }
  
    try {
      const response = await axiosInstance.post("/emotion", { emoji });
      if (response.status === 200) {
        const data = response.data;
        setSelectedEmoji(emoji);
        setSuggestion(data.suggestion);
        localStorage.setItem("emojiName", data.name)
        localStorage.setItem("selectedEmoji", emoji);
        localStorage.setItem("suggestion", data.suggestion);
        localStorage.setItem("emojiDate", new Date().toDateString()); 
      } else {
        alert("Failed to save emotion. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message === 'Emotion already selected today.') {
        alert("You have already selected an emotion today. Please try again tomorrow!");
      } else {
        console.error('Error occurred while saving emotion:', error.response ? error.response.data : error.message);
        alert("An error occurred while saving emotion. Please try again.");
      }
    }    
  };    

  const handleNavigateToVent = () => {
    if (selectedEmoji) {
      navigate(`/vent?emoji=${selectedEmoji}`);
    } else {
      alert("Please select an emoji to proceed.");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const groupedEmojis = [];
  for (let i = 0; i < emojiList.length; i += 2) {
    groupedEmojis.push(emojiList.slice(i, i + 2));
  }

  return (
    <div className="m-auto text-center w-1/2">
      <h2 className="text-xl font-medium">Select Your Emotion</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Slider {...settings}>
          {groupedEmojis.map((emojiGroup, index) => (
            <div key={index} className="flex flex-row p-5">
              {emojiGroup.map((emojiItem) => (
                <div
                  key={emojiItem.label}
                  className={`emoji-item ${selectedEmoji === emojiItem.emoji ? "selected" : ""} flex flex-col items-center`}
                  onClick={() => handleEmojiSelect(emojiItem.emoji)}
                  style={{ cursor: selectedEmoji ? 'not-allowed' : 'pointer' }} 
                >
                  <span className="text-4xl">{emojiItem.emoji}</span>
                  <span className="mb-2 text-lg">{emojiItem.label}</span>
                </div>
              ))}
            </div>
          ))}
        </Slider>
      )}

      <div className="mt-5">
        <h3 className="text-xl font-medium">
          Selected Emotion: {selectedEmoji || "None"}
        </h3>
        <p>Suggestion: {suggestion || "Remember, it's okay to feel this way!"}</p>
      </div>

      {selectedEmoji && (
        <div className="mt-5">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleNavigateToVent}
          >
            Click here to feel free
          </button>
        </div>
      )}
    </div>
  );
};

export default EmojiCarousel;
