import React from 'react';
import './App.css';
import InfiniteScroll from './components/InfiniteScroll';

function App() {
  const items = [
    { content: <div>🚀 Item 1: Welcome to Infinite Scroll</div> },
    { content: <div>⭐ Item 2: Smooth scrolling experience</div> },
    { content: <div>🎨 Item 3: Beautiful animations</div> },
    { content: <div>💡 Item 4: Powered by GSAP</div> },
    { content: <div>🔥 Item 5: Drag to scroll</div> },
    { content: <div>🌟 Item 6: Wheel support</div> },
    { content: <div>🎯 Item 7: Touch enabled</div> },
    { content: <div>🚦 Item 8: Auto-play option</div> },
    { content: <div>🎪 Item 9: Customizable</div> },
    { content: <div>🏆 Item 10: Performance optimized</div> }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Infinite Scroll Demo</h1>

        <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem' }}>
          <div>
            <h3>Default Scroll</h3>
            <InfiniteScroll
              items={items}
              width="25rem"
              maxHeight="500px"
            />
          </div>

          <div>
            <h3>Tilted with Autoplay</h3>
            <InfiniteScroll
              items={items}
              width="25rem"
              maxHeight="500px"
              isTilted={true}
              tiltDirection="left"
              autoplay={true}
              autoplaySpeed={0.5}
              autoplayDirection="down"
              pauseOnHover={true}
            />
          </div>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          Try scrolling, dragging, or using your mouse wheel!
        </p>
      </header>
    </div>
  );
}

export default App;
