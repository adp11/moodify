import "../App.css";
import React from "react";

function TrackList() {
  return (
    <div className="Track-list">
      <table>
        <thead>
          <tr>
            <th>TRACK</th>
            <th>ARTIST</th>
            <th>ALBUM</th>
            <th>TIME</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="bold">
              <img src={`${window.location.origin}/images/sample.jpg`} alt="" />
              Life is good
            </td>
            <td>Future, Drake</td>
            <td>Life is good</td>
            <td>3:21</td>
          </tr>
          <tr>
            <td className="bold">
              <img src={`${window.location.origin}/images/sample.jpg`} alt="" />
              Life is good
            </td>
            <td>Future, Drake</td>
            <td>Life is good</td>
            <td>3:21</td>
          </tr>
          <tr>
            <td className="bold">
              <img src={`${window.location.origin}/images/sample.jpg`} alt="" />
              Life is good
            </td>
            <td>Future, Drake</td>
            <td>Life is good</td>
            <td>3:21</td>
          </tr>
          <tr>
            <td className="bold">
              <img src={`${window.location.origin}/images/sample.jpg`} alt="" />
              Taking It Out
            </td>
            <td>DaBaby</td>
            <td>Baby on Baby</td>
            <td>4:12</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TrackList;
