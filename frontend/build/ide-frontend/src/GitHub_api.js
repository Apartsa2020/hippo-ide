/* ---------------------
 * !!! GitHub_api.js !!!
 * --------------------- 
 * This .js file is to implement some async functions which fetch resource from github
 * 1. Get User Avatar from User Name
 * 2. Get Repo Star Number 
 */ 

import { LogInfo } from './ChangeLog';


export async function getGitHubAvatarFromUserName(userName) {
    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    const avatar_api = "https://avatars.githubusercontent.com/";
    const finalURL = avatar_api + userName;
    // alert("final url = " + finalURL);
    let resp = await (fetch(finalURL, {
        "method": "GET",
        "mode": "cors",
    }));
    if (resp.ok) {
        // Then create a local URL for that image and print it 
        console.log(`HTTP fetch OK with status = ${resp.status}`);
        let image = await (resp.blob());
        let outside = URL.createObjectURL(image);

        console.log("outside = " + outside);
        
        return outside;
    }
    else {
        console.log("HTTP-Error: " + resp.status);
        return null;
    }
}



export async function getGitHubRepoStarNumber(repoOwner, repoName) {
    const baseAPI = "https://api.github.com/repos/";
    const finalAPI = baseAPI + repoOwner + "/" + repoName;
    // console.log(`final api = ${finalAPI}`);

    let response = await(fetch(finalAPI, {
        "method": "GET",
        "mode": "cors",
    }));
    if (response.ok) {
        // console.log(`getGitHubRepoStarNumber: fetch ok with status code = ${response.status}`);
        let json = await(response.json());
        // console.log(`getGitHubRepoStarNumber: star number = ${json["stargazers_count"]}`);
        return new Promise(function(resolve, reject) {
            resolve(Number(json["stargazers_count"]));
        });
    }
    else {
        console.log(`getGitHubRepoStarNumber: fetch failed with status code = ${response.status}`);
        return new Promise(function(resolve, reject) {
            reject(null);
        });
    }
}


export async function getGitHubRepoContributors(repoOwner, repoName) {
    const baseAPI = "https://api.github.com/repos/";
    const finalAPI = baseAPI + repoOwner + "/" + repoName + "/contributors";
    // console.log(`getGitHubRepoContributors function: final api = ${finalAPI}`);

    let contributorArray = [];

    let response = await(fetch(finalAPI, {
        "method": "GET",
        "mode": "cors",
    }));
    if (response.ok) {
        // console.log(`getGitHubRepoContributors function: fetch success with status code = ${response.status}`);
        let json = await( response.json() );
        // console.log(`json = ${JSON.stringify(json)}`);
        json.map(function(item, index) {
            console.log(item["login"]);
            contributorArray.push(item["login"]);
        });

        // console.log(`getGitHubRepoContributors function: contributor array = ${contributorArray}`);

        return new Promise(function(resolve, reject) {
            resolve(contributorArray);
        })
    }
    else {
        console.log(`getGitHubRepoContributors function: fetch failed with status code = ${response.status}`);
        return new Promise((resolve, reject) => reject(null));
    }
}




export async function getRepoCommitArray(repoOwner, repoName) {
    const baseAPI = "https://api.github.com/repos/";
    const finalURL = baseAPI + repoOwner + "/" + repoName + "/commits";

    // console.log(`getRepo commit array url = ${finalURL}`);

    let commitArray = [];


    let response = await( fetch(finalURL, {
        "method": "GET",
        "mode": "cors",
    }) );
    if (response.ok) {
        // console.log(`getRepo commit array: fetch success with status code = ${response.status}`);
        let json = await response.json();
        // console.log(`commit json = ${json}`);
        
        json.map(( item, index ) => {
            let commitInfo = item["commit"];
            let html_url = item["html_url"];
            // console.log(`commit info = ${JSON.stringify(commitInfo)}`);

            let contributor = commitInfo["author"]["name"];
            let email = commitInfo["author"]["email"];
            let date = commitInfo["author"]["date"];
            let message = commitInfo["message"];
            

            // console.log(`contributor = ${contributor}, email = ${email}, date = ${date}, message = ${message}, html_url = ${html_url}`);

            commitArray.push(new LogInfo(contributor, date, email, message, html_url));
        });
        
        // console.log(`final commit array = ${commitArray}`);
        return (new Promise( ( resolve, reject ) => {
            resolve(commitArray);
        }));
    }
    else {
        console.log(`getRepo commit array: fetch failed`);
        return (new Promise( (resolve, reject) => {
            reject(null);
        }));
    }
}