import Link from "next/link";
import styled from "styled-components";

interface Props {
  link: string;
  children: React.ReactNode;
}

const StarLink = ({ link, children }: Props) => {
  return (
    <StyledWrapper className="flex text-nowrap w-full sm:w-1/2">
      <Link href={link} className="text-center w-full">
        {children}
        <div className="star-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            version="1.1"
            style={{
              shapeRendering: "geometricPrecision",
              textRendering: "geometricPrecision",
              //   imageRendering: "optimizeQuality",
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
            viewBox="0 0 784.11 815.53"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs />
            <g id="Layer_x0020_1">
              <metadata id="CorelCorpID_0Corel-Layer" />
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              />
            </g>
          </svg>
        </div>
        <div className="star-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            version="1.1"
            style={{
              shapeRendering: "geometricPrecision",
              textRendering: "geometricPrecision",
              //   imageRendering: "optimizeQuality",
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
            viewBox="0 0 784.11 815.53"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs />
            <g id="Layer_x0020_1">
              <metadata id="CorelCorpID_0Corel-Layer" />
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              />
            </g>
          </svg>
        </div>
        <div className="star-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            version="1.1"
            style={{
              shapeRendering: "geometricPrecision",
              textRendering: "geometricPrecision",
              //   imageRendering: "optimizeQuality",
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
            viewBox="0 0 784.11 815.53"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs />
            <g id="Layer_x0020_1">
              <metadata id="CorelCorpID_0Corel-Layer" />
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              />
            </g>
          </svg>
        </div>
        <div className="star-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            version="1.1"
            style={{
              shapeRendering: "geometricPrecision",
              textRendering: "geometricPrecision",
              //   imageRendering: "optimizeQuality",
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
            viewBox="0 0 784.11 815.53"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs />
            <g id="Layer_x0020_1">
              <metadata id="CorelCorpID_0Corel-Layer" />
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              />
            </g>
          </svg>
        </div>
        <div className="star-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            version="1.1"
            style={{
              shapeRendering: "geometricPrecision",
              textRendering: "geometricPrecision",
              //   imageRendering: "optimizeQuality",
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
            viewBox="0 0 784.11 815.53"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs />
            <g id="Layer_x0020_1">
              <metadata id="CorelCorpID_0Corel-Layer" />
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              />
            </g>
          </svg>
        </div>
        <div className="star-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            version="1.1"
            style={{
              shapeRendering: "geometricPrecision",
              textRendering: "geometricPrecision",
              //   imageRendering: "optimizeQuality",
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
            viewBox="0 0 784.11 815.53"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs />
            <g id="Layer_x0020_1">
              <metadata id="CorelCorpID_0Corel-Layer" />
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              />
            </g>
          </svg>
        </div>
      </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  a {
    position: relative;
    padding: 7px 66px;
    background: var(--pink);
    font-size: 16px;
    font-weight: 500;
    color: var(--white);
    border: 2px solid var(--pink);
    border-radius: 12px;
    box-shadow: 0 0 0 #fec1958c;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .star-1 {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 25px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
  }

  .star-2 {
    position: absolute;
    top: 45%;
    left: 45%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-3 {
    position: absolute;
    top: 40%;
    left: 40%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-4 {
    position: absolute;
    top: 20%;
    left: 40%;
    width: 8px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-5 {
    position: absolute;
    top: 25%;
    left: 45%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-6 {
    position: absolute;
    top: 5%;
    left: 50%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.8s ease;
  }

  a:hover {
    background: var(--yellow);
    color: var(--black);
    border-color: var(--black);
    box-shadow: 0 0 25px #fec1958c;
  }

  a:hover .star-1 {
    position: absolute;
    top: -80%;
    left: -30%;
    width: 25px;
    height: auto;
    filter: drop-shadow(0 0 10px var(--pink));
    z-index: 2;
  }

  a:hover .star-2 {
    position: absolute;
    top: -25%;
    left: 10%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 10px var(--blue-600));
    z-index: 2;
  }

  a:hover .star-3 {
    position: absolute;
    top: 55%;
    left: 25%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  a:hover .star-4 {
    position: absolute;
    top: 30%;
    left: 80%;
    width: 8px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  a:hover .star-5 {
    position: absolute;
    top: 25%;
    left: 115%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  a:hover .star-6 {
    position: absolute;
    top: 5%;
    left: 60%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  .fil0 {
    fill: var(--black);
  }
`;

export default StarLink;
