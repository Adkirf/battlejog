import React, {useState, useEffect} from 'react'

function SquaredMenu(menuTiles:String[], centerTile: JSX.Element, tileHeight: number,handleMenuClick: Function) {
    const [centerRow, setCenterRow] = useState(0)
    const [squares, setSquares] = useState<JSX.Element[]>([]);
    const [selectedSquares, setSelectedSquares] = useState<HTMLButtonElement[]>([]);
  
    useEffect(()=>{
      initSquares(); 
  
      const handleResize = () => {
        initSquares();
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useEffect(()=>{
      const isDouble: String[] =[];
      selectedSquares.forEach(square =>{
        if(isDouble.includes(square.textContent!)){
          handleMenuClick(square.textContent);
        }else{
          isDouble.push(square.textContent!);
        }
      })
    }, [selectedSquares]);
  
    const getNumCol = () => {
  
      const homeDiv = document.querySelector('.home');
      if(homeDiv){
        const computedStyles = window.getComputedStyle(homeDiv!);
        const gridColumnValue = computedStyles.getPropertyValue('grid-template-columns');
        const numColumns = gridColumnValue.split(' ').length;
        return numColumns;
      }
      return 0;
    }
    const getNumRow = () => {
      const windowHeight = window.innerHeight;
      if(windowHeight < 600) {return 5;}
      return 5;
  
    }
    const initSquares = () =>{
      const numCols = getNumCol();
      const numRows = getNumRow();
      setCenterRow((numRows/2)+0.5);
      
      const squares = [];
  
      const amountSquares = numCols * (numRows - 1);
      for(let i = 0; i<amountSquares; i++){
        squares.push(
          <button onClick={(e)=>handleSquareClick(e)} key={i} className="square"></button>
        )
      }
  
      
      let visibleSqaures = 0;
  
      const randomSort = [...squares].sort(() => Math.random() - 0.5);
      const visibles = randomSort.slice(0, (menuTiles.length*2));
      const modifiedSquares = squares.map((square:any) => {
        if (visibles.includes(square)) {
          const newClassName = `square visible`;
          const labelIndex = Math.floor(visibleSqaures / 2); 
          const label = menuTiles[labelIndex]; 
          visibleSqaures += 1;
          return React.cloneElement(square, { className: newClassName },label);
        } else {
          return square;
        }
      });
  
      
      setSquares(modifiedSquares);
    }
  
    const centerStyle = {
      gridColumn: '1 / -1',
      gridRow: `${centerRow-tileHeight}/${centerRow+tileHeight}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '4rem',
    };
  
    const gridStyle ={
      gridTemplateRows: "repeat(auto-fit, 88px)",
      gridTemplateColumns: "repeat(auto-fit, 72px)"
    }
  
    const handleSquareClick = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const button = event.currentTarget;
      button.classList.toggle("selected");
  
      if (button.classList.contains("selected")) {
        await setSelectedSquares(prevState => [...prevState, button]);
      } else {
        await setSelectedSquares(prevState => prevState.filter(b => b !== button));
      }
  
  }
  
    return(
      <div style={gridStyle} className="home">
          <div style={centerStyle}> {centerTile} </div>
          {squares}
      </div>
    );
  }

export default SquaredMenu