module.exports = [
    // Comment added to make change

    /************************************************************************************************************************************** */
    {
        sponsorName: "BoysandGirls",
        sponsorType: "Local",
        sponsorImage: "png file",
        defaultHref: "http://bassforcash.com/schedule/",
        sponsorships: [{
            name: "Boys and Girls Club of Henderson, NC",
            type: [

                {
                    type: "charityTx", //This tells where to position the sponsor featuredTx, lake, charityTx, txPage, Banner, lakeTx, txPage
                    image: "png file",
                    lake: [
                        "Kerr" // for lake or tx sponsor
                    ],
                    startDate: [""],
                    endDate: [""],
                    text: ["Kerr Lake April 20th"], // For featuredTx, lakeTx and charityTx
                    stScope: ["NC, VA"], // States or All
                    detail: ["Charity Tournament Combined with BFCS Tx"],
                    link: ["http://bassforcash.com/schedule/"]
                }
            ]
        }],
        lat: 36.329107,
        long: -78.410444
    }
]