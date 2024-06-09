import React from "react";
import "../../styles/RewardsV1.css";

const RewardV1 = () => {
  return (
    <div class="card">
      <div class="content">
        <div class="back">
          <div class="back-content">
           
            <strong>Hover Me</strong>
          </div>
        </div>
        <div class="front">
          <div class="img">
            <div class="circle"></div>
            <div class="circle" id="right"></div>
            <div class="circle" id="bottom"></div>
          </div>

          <div class="front-content">
            <small class="badge">Pasta</small>
            <div class="description">
              <div class="title">
                <p class="title">
                  <strong>Spaguetti Bolognese</strong>
                </p>
               
              </div>
              <p class="card-footer">30 Mins &nbsp; | &nbsp; 1 Serving</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardV1;
