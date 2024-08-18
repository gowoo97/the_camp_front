import React, { useEffect, useState } from "react";
import ImageBox from "../../components/detail/ImageBox";
import TitleBox from "../../components/detail/TitleBox";
import styles from "../../styles/detail/DetailPage.module.css"
import ReviewBox from "../../components/detail/ReviewBox";
import { Link, useNavigate, useParams } from "react-router-dom";
import ZoneBox from "../../components/admin/ZoneBox"
import apiFetch from "../../utils/api";
import ReviewCampsiteList from '../review/ReviewCampsiteList';
import styled from 'styled-components';


function DetailPage(){
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(id);

    const[campsite,setCampsite] = useState({});
    const[isLogin, setIsLogin] = useState(false);

    useEffect(()=>{

        const script = document.createElement("script");
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey={appkey}&autoload=false";
        script.async = true;
        document.body.appendChild(script);

        script.addEventListener("load", ()=>{
            window.kakao.maps.load(()=>{
                const response = apiFetch("/campsite/zone/site/"+id , {
                    method:'GET',
                }).then((res) => res.json())
                .then((data) => {
                    
        
                    const container = document.getElementById('map');
                     const options = {
                        center: new window.kakao.maps.LatLng(data?.mapY, data?.mapX),
                     level: 3 
                     };
        
                    const map = new window.kakao.maps.Map(container, options);
        
                    var marker = new window.kakao.maps.Marker({
                        map:map,
                        position: new window.kakao.maps.LatLng(data?.mapY,data?.mapX)
                    });
        
                   
                     setCampsite(data);
                });
            })

        })


        

        return ()=> script.remove();
        
    },[id]);

    useEffect(() => {
        const LoadLoginUser = async () => {
            try {
                const response = await apiFetch(`/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization" : localStorage.getItem("Authorization")
                    }
                });
                const json = await response.json();
                if (response.ok) {
                    setIsLogin(true);
                }
            } catch(error) {
                if (error.message === "404") {
                    setIsLogin(false);
                    return;
                }
            }
        }
        LoadLoginUser();
    }, [])

    const changeToReservationPage = (e, campsiteSeq) => {
        navigate(`/user/zone/${campsiteSeq}`)
    }

    const changeToReviewCreatePage = (e, campsiteSeq) => {
        const data = {
            campsiteName : campsite.facltNm
        }
        navigate(`/user/review/create/${campsiteSeq}`, { state : data})
    }

    
    return(
        <div style={{margin:"0 auto", display:"flex" , justifyContent:"center"}}>
            <div>
            <h1>{campsite.facltNm}</h1>
            <ImageBox width="1200px" height="200px" src={campsite.firstImageUrl}></ImageBox>
            <h5>{campsite.addr1}</h5>
            <div className={styles.container}>
            <div>
                <div id="map" style={{width:'500px' , height:'400px'}}/>
            </div>
            <TitleBox title="캠핑장 소개">
                <p>
                    {
                        campsite.featureNm  
                    }
                </p>
            </TitleBox>
            </div>
            <TitleBox title="시설">
                {
                    campsite.sbrsCl
                }
            </TitleBox>

            <TitleBox title="구역">
                {
                    campsite?.zones?.map((item,i)=>
                        <Link to={"/user/zone/"+item.seq} key={i}>
                        <div style={{border:"1px solid black" , borderRadius:"10px",margin:"10px", width:"1200px"}}>
                            <h3>{ item.title }</h3>
                            <p>{ item.intro}</p>
                            <p>
                                <span>체크인:{item.checkin}</span>
                                <span style={{marginLeft:"10px"}}>체크아웃:{item.checkout}</span>
                            </p>
                        </div>
                        </Link>
                    )
                }
            </TitleBox>

            <TitleBox title="후기">
                <ReviewCampsiteList campsiteSeq={id} isDisplay={false}  />
                {isLogin ? <ReviewButton onClick={(e) => changeToReviewCreatePage(e, id)}>리뷰작성</ReviewButton>
                : null}
                
            </TitleBox>
            </div>
        </div>
    );
}

const ReviewButton = styled.button`
  background-color: #979797;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #adadad;
  }
`;


export default DetailPage;



