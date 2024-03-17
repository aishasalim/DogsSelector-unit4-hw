import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dogInfo, setDogInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [prevDogs, setPrevDogs] = useState([]);
  const [dogCount, setDogCount] = useState(0);
  const [listBannedAtr, setListBannedAtr] = useState([]); 
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
  const query = `https://api.thedogapi.com/v1/images/search?api_key=${ACCESS_KEY}&limit=15&has_breeds=1`;


  const callAPI = async () => {
    setIsLoading(true); 
    try {
      const response = await fetch(query);
      const json = await response.json();
      if (json.length === 0) {
        alert("Oops! Something went wrong with that query, let's try again!")
      } else {
        setDogInfo(json);
        setIsLoading(false); 
        setListBannedAtr([]);
        setPrevDogs([]);
      }
    } catch (error) {
      console.error('Error fetching dog info:', error);
    }
  };

  useEffect(() => {}, [callAPI]);
  useEffect(() => {
    if (dogCount < dogInfo.length) {
      setPrevDogs((prevDogs) => [...prevDogs, dogInfo[dogCount]]);
    }
  }, [dogCount, dogInfo]);
  

  const updateNext = () => {
    setDogCount((prevCount) => {
      if (prevCount >= dogInfo.length - 1) {
        alert("No more dogs available!");
        return prevCount; 
      } else {
        return prevCount + 1; 
      }
    });
  };
  
  const banAttribute = (attribute, type) => {
    const lowerCaseAttribute = attribute.toLowerCase();
    let displayAttribute = '';
  
    if (type === 'weight' && dogInfo[dogCount].breeds[0].weight) {
      displayAttribute = `${attribute} kg`;
    } else if (type === 'height' && dogInfo[dogCount].breeds[0].height) {
      displayAttribute = `${attribute} cm`;
    } else {
      displayAttribute = attribute;
    }
  
    const filteredDogInfo = dogInfo.filter(dog => {
      const breed = dog.breeds[0];
      return (
        (!breed.weight || !breed.weight.metric.toLowerCase().includes(lowerCaseAttribute)) &&
        (!breed.height || !breed.height.metric.toLowerCase().includes(lowerCaseAttribute)) &&
        !breed.life_span.toLowerCase().includes(lowerCaseAttribute) &&
        !breed.breed_group.toLowerCase().includes(lowerCaseAttribute)
      );
    });
  
    if (filteredDogInfo.length === 0) {
      alert("No more dogs available!");
      return;
    }
  
    setDogInfo(filteredDogInfo);
    setListBannedAtr((prevList) => [...prevList, displayAttribute]);
  };
  
  
  
  return (
    <>
      <div className='app'>
        <h1>🐕 Trippin' on Dogs 🐕</h1>
        <h2>Discover dogs from your wildest dreams! 🐶</h2>
        
        <div className='dogсard'>
          {isLoading ? <p>Press Start button to load a dog profile</p> :
          <div className='dogсard'>
            <h3> {dogInfo[dogCount].breeds[0].name} </h3>
            {dogInfo[dogCount].breeds[0].temperament && (
            <p className="temperament">Temperament: {dogInfo[dogCount].breeds[0].temperament}</p>
            )}
            <div className="button-conainer">
              <button className="attribute-button" onClick={() => banAttribute(dogInfo[dogCount].breeds[0].weight.metric, "weight")}>{dogInfo[dogCount].breeds[0].weight.metric} kg</button>
              <button className="attribute-button" onClick={() => banAttribute(dogInfo[dogCount].breeds[0].height.metric, "height")}>{dogInfo[dogCount].breeds[0].height.metric} cm</button>

              
              <button className="attribute-button" onClick={() => banAttribute(dogInfo[dogCount].breeds[0].life_span, "")}>{dogInfo[dogCount].breeds[0].life_span}</button>
              {dogInfo[dogCount].breeds[0].breed_group && (
                <button className="attribute-button" onClick={() => banAttribute(dogInfo[dogCount].breeds[0].breed_group, "")}>
                  {dogInfo[dogCount].breeds[0].breed_group}
                </button>
              )}
            </div>
            <img src={dogInfo[dogCount].url} alt='dog picture' width={350} />
          </div>}
        </div>
        
          <div className='sideNav'>
            <h2>Ban List</h2>
            <h3>Select an attribute in your listing to ban it</h3>
            {listBannedAtr.length === 0 ? (
              <p>Nothing banned yet</p>
            ) : (
              listBannedAtr.map((bannedAttribute, index) => (
                <div key={index} className="banned-attribute">
                  <button style={{ marginBottom: '2em' }}>{bannedAttribute}</button>
                </div>
              ))
            )}
          </div>
  
          <div className="history-sidebar">
            <h2>Who have we seen so far?</h2>    
            {prevDogs.length > 0 && prevDogs.map( (dog, index) => (
              <div key={index} className="dog-history">
                <h3>{dog.breeds[0].name}</h3>
                <img src={dog.url} alt='dog picture' width={150} style={{ marginBottom: '2em' }}/>
              </div>
            ))}
          </div>

        

        <button onClick={callAPI}>
        {dogInfo.length === 0 ? "Start!" : "Restart!"}
        </button>
        {dogInfo.length !== 0 && (
        <button onClick={updateNext}>Next!</button>
        )}

      </div>
    </>
  );
}

export default App;

