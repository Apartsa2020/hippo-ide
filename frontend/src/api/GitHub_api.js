/* ---------------------
 * !!! GitHub_api.js !!!
 * --------------------- 
 * This .js file is to implement some async functions which fetch resource from github
 * 1. getGithubRepoStarNumber
 * 2. getGithubRepoContributor
 * 3. getGithubLastCommitDate
 * 4. getGithubCommitArray
 * 
 * 
 * 主要params参数
 * @params      repoOwner   {string}    github仓库拥有者
 * @params      repoName    {string}    github仓库名
 * @params      baseURL     {string}    基础github接口，repo信息皆为  "https://api.github.com/repos/"
 * @params      finalURL    {string}    各函数实际调用的接口URL（baseURL + 参数）
 */ 

import { LogInfo } from '../IndexPage';






export async function getGitHubRepoStarNumber(repoOwner, repoName) {
    const baseAPI = "https://api.github.com/repos/";
    const finalAPI = baseAPI + repoOwner + "/" + repoName;

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
        json.forEach(function(item, index) {
            contributorArray.push(item["login"]);
        });

        // console.log(`getGitHubRepoContributors function: contributor array = ${contributorArray}`);
        return contributorArray;
    }
    else {
        console.log(`getGitHubRepoContributors function: fetch failed with status code = ${response.status}`);
        return Promise.reject( new Error(`getGitHubRepoContributors function: fetch failed with status code = ${response.status}`) );
    }
}



export async function getRepoLastCommitDate( repoOwner, repoName ) {
    let lastModifiedDate = null;

    try {
        let commitArray = await( getRepoCommitArray( repoOwner, repoName ) );
        commitArray.forEach( (item, index) => {
            // console.log(`item = ${JSON.stringify(item)}`);
            if (lastModifiedDate === null) {
                lastModifiedDate = item.date;
            }
            else {
                if (item.date > lastModifiedDate) {
                    lastModifiedDate = item.date;
                }
            }
        } );
        return new Date(lastModifiedDate);
    }
    catch(error) {
        console.log( `getRepoLastModifiedDate: ${error}` );
        return Promise.reject( new Error( `getRepoLastModifiedDate: ${error}` ) );
    }
}



export async function getRepoCommitArray(repoOwner, repoName) {
    const baseAPI = "https://api.github.com/repos/";
    const finalURL = baseAPI + repoOwner + "/" + repoName + "/commits";

    let commitArray = [];

    try {
        let response = await( fetch(finalURL, {
            "method": "GET",
            "mode": "cors",
        }) );
        if (response.ok) {
            // console.log(`getRepo commit array: fetch success with status code = ${response.status}`);
            let json = await response.json();
            // console.log(`commit json = ${json}`);
            
            json.forEach( ( item, index ) => {
                let commitInfo = item["commit"];
                let html_url = item["html_url"];
                let contributor = commitInfo["author"]["name"];
                let email = commitInfo["author"]["email"];
                let date = commitInfo["author"]["date"];
                let message = commitInfo["message"];
    
                commitArray.push(new LogInfo(contributor, date, email, message, html_url));
            });
            
            // console.log(`final commit array = ${commitArray}`);
            return commitArray;
        }
        else {
            console.log(`getRepo commit array: fetch failed with status code = ${response.status}`);
            return Promise.reject( new Error( `getRepo commit array: fetch failed with status code = ${response.status}` ) );
        }
    }
    catch(error) {
        return Promise.reject( new Error( `getRepo commit array: ${error}` ) );
    }
}