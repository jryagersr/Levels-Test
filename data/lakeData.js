
module.exports = [

    // ALABAMA  ---------------------------------------------------------------------------------------------------------

    {
        bodyOfWater: "Aliceville", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 137.0,
        topOfFloodControl: 145.0, //guess
        lat: 33.260887,
        long: -88.298818,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=25512039&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/aliceville",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Bankhead", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 255.0,
        topOfFloodControl: 263.0, //guess
        lat: 33.500505,
        long: -87.287597,
        elevURL: "http://apcshorelines.com/our-lakes/bankhead",
        flowURL: "",
        href: "/lakes/bankhead",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Bouldin", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 252.0,
        topOfFloodControl: 260.0, //guess
        lat: 32.567057,
        long: -86.270391,
        elevURL: "http://apcshorelines.com/our-lakes/walter-bouldin",
        flowURL: "",
        href: "/lakes/bouldin",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Eufaula (AL)", // lake name
        state: ["Alabama", "Georgia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 188.0,
        topOfFloodControl: 205.0, //guess
        lat: 31.681074,
        long: -85.097779,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=25898039&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/eufaulaal",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Guntersville", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 594.0,
        topOfFloodControl: 605.0, // guess
        lat: 34.458445,
        long: -86.206939,
        elevURL: "https://soa.tva.gov/api/river/observed-data/GVDA1",
        flowURL: "",
        href: "/lakes/guntersville",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Harris", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 793.0,
        topOfFloodControl: 803.0, // guess
        lat: 33.310325,
        long: -87.399978,
        elevURL: "http://apcshorelines.com/our-lakes/harris",
        flowURL: "",
        href: "/lakes/harris",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Holt", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 187.0,
        topOfFloodControl: 200.0, // guess
        lat: 33.310325,
        long: -87.399978,
        elevURL: "http://apcshorelines.com/our-lakes/holt",
        flowURL: "",
        href: "/lakes/holt",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Jordan (AL)", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 252.0,
        topOfFloodControl: 260.0, // guess
        lat: 32.640703,
        long: -86.296619,
        elevURL: "http://apcshorelines.com/our-lakes/jordan",
        flowURL: "",
        href: "/lakes/jordanal",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Lay", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 396.0,
        topOfFloodControl: 404.0, // guess
        lat: 33.112973,
        long: -86.483895,
        elevURL: "http://apcshorelines.com/our-lakes/lay",
        flowURL: "",
        href: "/lakes/lay",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Logan Martin", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 465.0,
        topOfFloodControl: 453.0, // guess
        lat: 33.584844,
        long: -86.218684,
        elevURL: "http://apcshorelines.com/our-lakes/logan-martin",
        flowURL: "",
        href: "/lakes/loganmartin",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Mitchell", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 312.0,
        topOfFloodControl: 320.0, // guess
        lat: 32.863256,
        long: -86.452222,
        elevURL: "http://apcshorelines.com/our-lakes/mitchell",
        flowURL: "",
        href: "/lakes/mitchell",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Neely Henry", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 508.0,
        topOfFloodControl: 516.0, // guess
        lat: 33.827617,
        long: -86.054435,
        elevURL: "http://apcshorelines.com/our-lakes/neely-henry",
        flowURL: "",
        href: "/lakes/neelyhenry",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Martin", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 491.0,
        topOfFloodControl: 499.0, // guess
        lat: 33.584844,
        long: -86.218684,
        elevURL: "http://apcshorelines.com/our-lakes/martin",
        flowURL: "",
        href: "/lakes/martin",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Pickwick", // lake name
        state: ["Alabama", "Mississippi", "Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 413.5,
        topOfFloodControl: 475.0, //guess
        lat: 34.907393,
        long: -88.040723,
        elevURL: "https://soa.tva.gov/api/river/observed-data/PICT1",
        flowURL: "",
        href: "/lakes/pickwick",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Smith", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 510.0,
        topOfFloodControl: 518.0, // guess
        lat: 34.027963,
        long: -87.125180,
        elevURL: "http://apcshorelines.com/our-lakes/smith",
        flowURL: "",
        href: "/lakes/smith",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Thurlow", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 288.0,
        topOfFloodControl: 296.0, // guess
        lat: 32.539681,
        long: -85.887188,
        elevURL: "http://apcshorelines.com/our-lakes/Thurlow",
        flowURL: "",
        href: "/lakes/thurlow",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Upper Bear Creek", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 594.0,
        topOfFloodControl: 605.0, // guess
        lat: 34.271946,
        long:  -87.693886,
        elevURL: "https://soa.tva.gov/api/river/observed-data/UBRA1",
        flowURL: "",
        href: "/lakes/upperbear",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Weiss", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 564.0,
        topOfFloodControl: 572.0, // guess
        lat: 34.197311,
        long: -85.606245,
        elevURL: "http://apcshorelines.com/our-lakes/weiss",
        flowURL: "",
        href: "/lakes/weiss",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Wheeler", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 552.28,
        topOfFloodControl: 560.0, // guess
        lat: 34.651033,
        long: -87.017641,
        elevURL: "https://soa.tva.gov/api/river/observed-data/WHLA1",
        flowURL: "",
        href: "/lakes/wheeler",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Wilson", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 509.0,
        topOfFloodControl: 517.0, // guess
        lat: 34.818539,
        long: -87.489826,
        elevURL: "https://soa.tva.gov/api/river/observed-data/WLSA1",
        flowURL: "",
        href: "/lakes/wilson",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Yates", // lake name
        state: ["Alabama"],
        data: [],
        refreshInterval: 60, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 344.0,
        topOfFloodControl: 352.0, // guess
        lat: 34.818539,
        long: -87.489826,
        elevURL: "http://apcshorelines.com/our-lakes/yates",
        flowURL: "",
        href: "/lakes/yates",
        dataSource: ["APC", "loadAds"], // array of calls to make to retrieve data
    },
    // Arizona  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Alamo", // lake name
        state: ["Arizona"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1160.4,
        lat: 34.262902,
        long: -113.573761,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=157145&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/alamo",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Havasu", // lake name
        state: ["Arizona", "California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 400.54, // 1329ft but data reported as a delta to full pool
        normalPool: 450.0,
        lat: 34.499044,
        long: -114.378362,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09427500&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/havasu",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    /*
                {
                    bodyOfWater: "Roosevelt", // lake name
                    data: [],
                    refreshInterval: 90, //minutes
                    lastRefresh: "12/31/18", // a Date 
                    seaLevelDelta: 0.0, // ft but data reported as a delta gage height
                    normalPool: 2094.0,
                    elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=52327029&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
                    flowURL: "",
                    href: "/lakes/rooseveltaz",
                    dataSource: ["USGS"], // array of calls to make to retrieve data
                }*/


    // ARKANSAS  ---------------------------------------------------------------------------------------------------------

    {
        bodyOfWater: "Arkansas River (Pine Bluff)", // lake name
        state: ["Arkansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 31.0,
        lat: 34.290278,
        long: -91.995556,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07294800&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/arkansasrvrpinebluff",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Beaver", // lake name
        state: ["Arkansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 1120.43,
        lat: 36.288882,
        long: -94.015482,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1615150&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/beaver",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
        resultsLink: "undefined",
    },
    {
        bodyOfWater: "Dardanelle", // lake name
        state: ["Arkansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 338.0,
        topOfFloodControl: 338.5,
        topOfDam: 339.0,
        lat: 35.370016,
        long: -93.399838,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1776150&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/dardenelle",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Greers Ferry", // lake name
        state: ["Arkansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 462.04,
        lat: 35.523713,
        long: -92.146595,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1946150&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/greersferry",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Hamilton", // lake name
        state: ["Arkansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 399.0,
        lat: 34.435554,
        long: -93.064535,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07358500&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/hamilton",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ouachita", // lake name
        state: ["Arkansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 578.0,
        lat: 34.587940,
        long: -93.338407,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=11092013&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/ouachita",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    // CALIFORNIA  ---------------------------------------------------------------------------------------------------------
    // Everything I can find on Camanche lake says water elevation is 135'
    // ACE is reporting a elevation of 220' Guessing 258'
    {
        bodyOfWater: "Camanche", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 258.0,
        lat: 38.221381,
        long: -120.960911,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=7438044&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/camanche",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Canyon", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 909.0,
        lat: 33.687159,
        long: -117.269968,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=219048&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/canyon",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Clear", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1318.26, // 1329ft but data reported as a delta to full pool
        normalPool: 1329.0,
        lat: 38.987617,
        long: -122.717792,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=11450000&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/clear",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Don Pedro", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 804.0,
        lat: 37.732655,
        long: -120.378979,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=7285044&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/donpedro",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Folsom", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 466.0,
        lat: 38.717852,
        long: -121.133390,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=9813044&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/folsom",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Iron Gate", // lake name
        state: ["California", "Oregon"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 2162.44, //but data reported as a delta to full pool
        normalPool: 2164.43,
        lat: 41.954328,
        long: -122.434672,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=11516530&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=11516530&period=PT168H&parameterCd=00060&siteType=ST&siteStatus=all",
        href: "/lakes/irongate",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Mendocino", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 737.0,
        lat: 39.215309,
        long: -123.172327,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=739044&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/mendocino",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "New Hogan", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 666.0,
        lat: 38.160071,
        long: -120.792308,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=502044&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/newhogan",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Pine Flat", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 903.9,
        lat: 36.857025,
        long: -119.300940,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=314044&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/pineflat",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    // Everything I can find on Sonoma lake says water elevation is 358'
    // ACE is reporting a elevation of 446' Guessing the pool should be about 458
    {
        bodyOfWater: "Sonoma", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 458.0,
        lat: 38.722618,
        long: -123.027628,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=507044&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/sonoma",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Success", // lake name
        state: ["California"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 656.0,
        lat: 36.074796,
        long: -118.914035,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=379044&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/success",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },

    // COLORADO  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Rifle Gap", // lake name
        state: ["Colorado"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 11.0,
        normalPool: 6000.0,
        lat: 39.629899,
        long: -107.754241,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09091900&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/riflegap",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Trinidad", // lake name
        state: ["Colorado"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 11.36,
        normalPool: 6230.0,
        lat: 37.137969,
        long: -104.566012,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07124400&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/trinidad",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    // FLORIDA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Big Harris (HC)", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 62.0,
        lat: 28.762634,
        long: -81.816544,
        elevURL: "http://webapub.sjrwmd.com/agws10/hdsnew/data.aspx?tp=3&stn=30053040_NAVD1988_POR&des=Lake%20Harris%20at%20Leesburg%20(WL)$284837.19$814855.96$Lake%20Harris%20Unit$Lake$Lake$Water%20Level%20(WL)",
        flowURL: "",
        href: "/lakes/bigharris",
        dataSource: ["SJRWMD", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Dora (HC)", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 62.0,
        lat: 28.786919,
        long: -81.680107,
        elevURL: "http://webapub.sjrwmd.com/agws10/hdsnew/data.aspx?tp=3&stn=30013010_NAVD1988_POR&des=Lake%20Dora%20at%20Mount%20Dora%20(WL)$284746.67$813838.67$Lake%20Harris%20Unit$Lake$Lake$Water%20Level%20(WL)",
        flowURL: "",
        href: "/lakes/dora",
        dataSource: ["SJRWMD"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Eustis (HC)", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 62.0,
        lat: 28.848252,
        long: -81.721496,
        elevURL: "http://webapub.sjrwmd.com/agws10/hdsnew/data.aspx?tp=3&stn=30083018_NAVD1988_POR&des=Lake%20Eustis%20at%20Eustis%20(WL)$285105.3$814126.02$Lake%20Harris%20Unit$Lake$Lake$Water%20Level%20(WL)",
        flowURL: "",
        href: "/lakes/eustis",
        dataSource: ["SJRWMD", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Griffin (HC)", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 62.0,
        lat: 28.856153,
        long: -81.845419,
        elevURL: "http://webapub.sjrwmd.com/agws10/hdsnew/data.aspx?tp=3&stn=30013010_NAVD1988_POR&des=Lake%20Dora%20at%20Mount%20Dora%20(WL)$284746.67$813838.67$Lake%20Harris%20Unit$Lake$Lake$Water%20Level%20(WL)",
        flowURL: "",
        href: "/lakes/griffin",
        dataSource: ["SJRWMD"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Hatchineha", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 50.65,
        lat: 28.011285,
        long: -81.399960,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=165038&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/hatchineha",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Istokpoga", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 39.4,
        lat: 27.372715,
        long: -81.287764,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=4069038&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/istokpoga",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Kenansville", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 20.0,
        lat: 27.812593,
        long: -80.785047,
        elevURL: "http://webapub.sjrwmd.com/agws10/hdsnew/data.aspx?tp=3&stn=01310555_NAVD1988_POR&des=S-250D%20South%20at%20Fellsmere%20(WL)$274921.142$804749.182$St.%20Johns%20Marsh%20Unit$Indian%20River$Surface%20Water$Water%20Level%20(WL)",
        flowURL: "",
        href: "/lakes/kenansville",
        dataSource: ["SJRWMD", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Kissimmee", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 49.0,
        lat: 27.911861,
        long: -81.282112,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=165038&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/kissimmee",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Minnehaha", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 125.0,
        normalPool: 225.0,
        lat: 28.535367,
        long: -81.768513,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02236840&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/minnehaha",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Okeechobee", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 12.0,
        lat: 26.959730,
        long: -80.790181,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1839038&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/okeechobee",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Seminole", // lake name
        state: ["Florida", "Georgia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 78.0,
        lat: 30.724724,
        long: -84.871265,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02357500&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/seminole",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Stick Marsh (Farm 13)", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 12.5,
        lat: 27.792952,
        long: -80.727619,
        elevURL: "http://webapub.sjrwmd.com/agws10/hdsnew/data.aspx?tp=3&stn=00960391_NAVD1988_POR&des=S-96B%20West%20at%20Fellsmere%20(WL)$274931.099$804428.589$Fellsmere$Brevard$Surface%20Water$Water%20Level%20(WL)",
        flowURL: "",
        href: "/lakes/stickmarsh",
        dataSource: ["SJRWMD", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Talquin", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 70.0,
        lat: 30.417830,
        long: -84.606598,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02329900&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/talquin",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "East Toho", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 58.0,
        lat: 28.200614,
        long: -81.389007,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1074038&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/easttoho",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Toho", // lake name
        state: ["Florida"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 52.0,
        lat: 28.226784,
        long: -81.392771,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1076038&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/toho",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },

    // GEORGIA ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Allatoona", // lake name 'Allatoona'
        state: ["Georgia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 840.0,
        lat: 34.132973,
        long: -84.627509,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=13257039&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/allatoona",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Lanier", // lake name
        state: ["Georgia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1071.0,
        lat: 34.215240,
        long: -83.971819,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02334400&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/lanier",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Oconee", // lake name
        state: ["Georgia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 435.0,
        lat: 33.450243,
        long: -83.262985,
        elevURL: "https://lakes.southernco.com/default.aspx",
        flowURL: "",
        href: "/lakes/oconee",
        dataSource: ["GPC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Sinclair", // lake name
        state: ["Georgia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 340.0,
        lat: 33.184953,
        long: -83.251959,
        elevURL: "https://lakes.southernco.com/default.aspx",
        flowURL: "",
        href: "/lakes/sinclair",
        dataSource: ["GPC", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "West Point", // lake name
        state: ["Alabama", "Georgia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 635.0,
        lat: 32.974759,
        long: -85.198377,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02339400&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/westpoint",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },

    // ILLINOIS  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Carlyle", // lake name
        state: ["Illinois"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 445.0,
        lat: 38.622475,
        long: -89.346391,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=590018&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/carlyle",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Clinton (IL)", // lake name
        state: ["Illinois"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 875.0,
        lat: 40.143002,
        long: -88.873364,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=05578300&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/clintonil",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Rend", // lake name
        state: ["Illinois"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 2, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 405.0,
        lat: 38.097955,
        long: -88.971885,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=773018&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/rend",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },

    // INDIANA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Brookville", // lake name
        state: ["Indiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 748.0,
        topOfFloodControl: 775.0,
        lat: 39.439722,
        long: -84.998889,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=125109&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/brookville",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Eagle Creek", // lake name
        state: ["Indiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 788.0,
        topOfFloodControl: 804.0, //guess
        lat: 39.849199,
        long: -86.305425,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03353450&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/eaglecreek",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Mississinewa", // lake name
        state: ["Indiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 725.0,
        topOfFloodControl: 779.0, //guess
        lat: 40.685754,
        long: -85.897141,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03326950&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/mississinewa",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Monroe", // lake name
        state: ["Indiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 2, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 538.0,
        topOfFloodControl: 556.0,
        lat: 39.059557,
        long: -86.442157,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03372400&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/monroe",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ohio River (Evansville)", // lake name
        state: ["Indiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 13.0,
        topOfFloodControl: 60.0, // guess
        lat: 37.965640,
        long: -87.580873,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03322000&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/ohioriverin",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Patoka", // lake name
        state: ["Indiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 535.0,
        topOfFloodControl: 548.0,
        lat: 38.425371,
        long: -86.658841,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03374498&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/patoka",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Raccoon", // lake name
        state: ["Indiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 663.28,
        topOfFloodControl: 690.0,
        lat: 39.722434,
        long: -87.071616,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03340870&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/raccoon",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Salmonie", // lake name
        state: ["Indiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 751.0,
        topOfFloodControl: 793.0,
        lat: 40.802213,
        long: -85.667668,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03324450&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/salmonie",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },

    // IOWA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Red Rock", // lake name
        state: ["Iowa"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1398.0, // water level is reported as a delta to full pool
        normalPool: 742.0,
        lat: 41.406061,
        long: -93.047140,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=50017&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/redrock",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "West Okoboji", // lake name
        state: ["Iowa"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1398.0, // water level is reported as a delta to full pool
        normalPool: 1398.0,
        lat: 43.375364,
        long: -95.153747,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06604200&period=PT168H&parameterCd=00065,00010&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/westokoboji",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },

    // KANSAS  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Clinton (KS)", // lake name
        state: ["Kansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 875.50,
        topOfFloodControl: 903.4,
        lat: 38.920332,
        long: -95.350975,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06891478&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/clinton",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Melvern", // lake name
        state: ["Kansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1036.0,
        topOfFloodControl: 1057.0,
        lat: 38.507650,
        long: -95.729820,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06910997&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/melvern",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Perry", // lake name
        state: ["Kansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 891.50,
        topOfFloodControl: 920.6,
        lat: 39.162375,
        long: -95.448666,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06890898&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/perry",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Pomona", // lake name
        state: ["Kansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 974.0,
        topOfFloodControl: 1003.0,
        lat: 38.658750,
        long: -95.574597,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06912490&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/pomona",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },

    // KENTUCKY  ---------------------------------------------------------------------------------------------------------

    {
        bodyOfWater: "Barkley", // lake name
        state: ["Kentucky", "Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 358.0,
        lat: 36.999930,
        long: -88.189288,
        elevURL: "https://soa.tva.gov/api/river/observed-data/BARK2",
        flowURL: "",
        href: "/lakes/barkley",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Barren", // lake name
        state: ["Kentucky"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 552.0,
        topOfFloodControl: 590.0,
        topOfDam: 618.0,
        lat: 36.882939,
        long: -86.103359,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=245109&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/barrenriver",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Cumberland", // lake name
        state: ["Kentucky"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 723.0,
        topOfFloodControl: 760.0,
        topOfDam: 773.0,
        lat: 36.874419,
        long: -85.074948,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=3228010&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/cumberland",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Kentucky", // lake name
        state: ["Kentucky", "Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 359.0,
        lat: 36.982417,
        long: -88.245251,
        elevURL: "https://soa.tva.gov/api/river/observed-data/KYDK2",
        flowURL: "",
        href: "/lakes/kentucky",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Green", // lake name
        state: ["Kentucky"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 675.0,
        topOfFloodControl: 713.0,
        topOfDam: 734.0,
        lat: 37.244688,
        long: -85.299316,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1108109&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/greenriver",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Laurel River Lake", // lake name
        state: ["Kentucky"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 1018.5,
        topOfFloodControl: 1030.0,
        topOfDam: 1035.0,
        lat: 36.956047, 
        long: -84.217414,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=3248010&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/laurelrvr",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Nolin", // lake name
        state: ["Kentucky"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 515.0,
        topOfFloodControl: 560.0,
        topOfDam: 581.0,
        lat: 37.276667,
        long: -86.245278,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1144109&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/nolin",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Rough", // lake name
        state: ["Kentucky"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 495.0,
        topOfFloodControl: 524.0,
        topOfDam: 554.0,
        lat: 37.610606,
        long: -86.483290,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1162109&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/rough",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Taylorsville", // lake name
        state: ["Kentucky"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 547.0,
        topOfFloodControl: 592.0,
        topOfDam: 623.0,
        lat: 38.015323,
        long: -85.268569,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=163109&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/taylorsville",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    // LOUISIANA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Atchafalaya River Basin", // lake name
        state: ["Louisiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 28.0,
        lat: 30.690560,
        long: -91.734875,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07381495&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/atchafalayrvrbasinmelville",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Fausse Point", // lake name
        state: ["Louisiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 0.0,
        lat: 30.062306,
        long: -91.608083,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=8758015&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/faussepoint",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Mississippi River (Knox)", // lake name
        state: ["Louisiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 60.0,
        lat: 31.073611,
        long: -91.581944,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07294800&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/mississippirvrknox",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },

    // MICHIGAN  ---------------------------------------------------------------------------------------------------------

    {
        bodyOfWater: "Austin", // lake name
        state: ["Michigan"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 845.65,
        normalPool: 853.0,
        lat: 42.180782,
        long: -85.557856,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04097188&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/austin",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Higgins", // lake name
        state: ["Michigan"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1149.6,
        normalPool: 1155.0,
        lat: 44.496205,
        long: -84.749850,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=442805084411001&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/higgins",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Houghton", // lake name
        state: ["Michigan"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1136.5,
        normalPool: 1145.0,
        lat: 44.333380,
        long: -84.756237,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=442400084472801&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/houghton",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Intermediate", // lake name
        state: ["Michigan"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 599.38,
        normalPool: 606.0,
        lat: 45.034359,
        long: -85.242023,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=450415085153501&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/intermediate",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Mullet", // lake name
        state: ["Michigan"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 594.0,
        lat: 45.519105,
        long: -84.528138,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04129950&period=PT168H&parameterCd=62615&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/intermediate",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Otsego", // lake name
        state: ["Michigan"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1187.4,
        normalPool: 1191.0,
        lat: 42.769369,
        long: -74.887660,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=445512084415301&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/otsego",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "St Clair", // lake name
        state: ["Michigan"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 574.0,
        lat: 42.466667,
        long: -82.666667,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=325005&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/stclair",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "St Helen", // lake name
        state: ["Michigan"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1148.4,
        normalPool: 1155.0,
        lat: 44.365965,
        long: -84.463713,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=442409084274001&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/sthelen",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },

    // MINNESOTA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Mille Lacs", // lake name
        state: ["Minnesota"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1240.40, // water level reprted as a delta to Full Pool - 100
        normalPool: 1251.0,
        lat: 46.239358,
        long: -93.662979,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=05284000&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/millelacs",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Minnetonka", // lake name
        state: ["Minnesota"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 929.0,
        lat: 44.905807,
        long: -93.637058,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=05289000&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/minnetonka",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },

    // MISSOURI  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Bull Shoals", // lake name
        state: ["Missouri", "Arkansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 659.0,
        topOfFloodControl: 695.0,
        lat: 36.455453,
        long: -92.645632,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1609150&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/bullshoals",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Lake of the Ozarks", // lake name
        state: ["Missouri"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 660.0,
        topOfFloodControl: 665.0,
        lat: 38.136876,
        long: -92.806876,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5043030&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/lakeoftheozarks",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Norfork", // lake name
        state: ["Missouri"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 553.75,
        topOfFloodControl: 580.0,
        lat: 36.361878,
        long: -92.233743,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=2211150&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/norfork",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Pomme De Terre", // lake name
        state: ["Missouri"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 839.0,
        topOfFloodControl: 874.0,
        lat: 37.893713,
        long: -93.312066,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=15222030&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/pommedeterre",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Table Rock", // lake name
        state: ["Missouri", "Arkansas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 915.0,
        lat: 36.601058,
        long: -93.322459,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1884150&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/tablerock",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Truman", // lake name
        state: ["Missouri"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 706.02,
        topOfFloodControl: 739.6,
        lat: 38.270197,
        long: -93.413133,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=15347030&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/truman",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Stockton", // lake name
        state: ["Missouri"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 867.0,
        lat: 37.654290,
        long: -93.772275,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5706030&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/stockton",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },

    // MISSISSIPPI  ---------------------------------------------------------------------------------------------------------

    {
        bodyOfWater: "Aberdeen", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0, // data reported as a delta to Full Pool -100
        normalPool: 40.5,
        lat: 33.831058,
        long: -88.519936,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02437100&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/aberdeen",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Amory", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0, // data reported as a delta to Full Pool -100
        normalPool: 220.0,
        lat: 34.064983,
        long: -88.425800,
        //need to use value index of 1 to get the headwaters data (lake) rather than tailwater )index 0
        //check timeseries[0].values[0].method[0].methodDiscription for "Headwater"
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02433496&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/amory",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Bay Springs", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // data reported as a delta to Full Pool -100
        normalPool: 407.0,
        lat: 34.574800,
        long: -88.313900,
        //need to use value index of 1 to get the headwaters data (lake) rather than tailwater )index 0
        //check timeseries[0].values[0].method[0].methodDiscription for "Headwater"
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02430005&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/baysprings",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Beaver Lake (MS)", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0, // data reported as a delta to Full Pool -100
        normalPool: 299.0,
        lat: 34.463072,
        long: -88.364861,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02430626&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/beaverlakems",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Columbus", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 164.0,
        lat: 33.526077,
        long: -88.485726,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=25832039&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/columbus",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Mississippi River (STL)", // lake name
        state: ["Misouri"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0, // data reported as a delta to Full Pool -100
        normalPool: 30.0,
        lat: 38.629000,
        long: -90.179778,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07010000&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/mississippirvrstl",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Missouri River (STL)", // lake name
        state: ["Missouri"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0, // data reported as a delta to Full Pool -100
        normalPool: 30.0,
        lat: 38.629000,
        long: -90.179778,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07010000&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/missourirvrstl",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Pool B", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0, // data reported as a delta to Full Pool -100
        normalPool: 245.0,
        lat: 34.064983,
        long: -88.425800,
        //need to use value index of 1 to get the headwaters data (lake) rather than tailwater )index 0
        //check timeseries[0].values[0].method[0].methodDiscription for "Headwater"
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02433151&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/poolb",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Queen", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0, // data reported as a delta to Full Pool -100
        normalPool: 270.0,
        lat: 34.257778,
        long: -88.424722,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02431011&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/queen",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ross Barnett", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 297.50,
        lat: 32.438277,
        long: -90.033388,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=14013&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/rossbarnett",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Saucer Creek", // lake name
        state: ["Mississippi"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0, // data reported as a delta to Full Pool -100
        normalPool: 330.0,
        lat: 34.463072,
        long: -88.364861,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02430161&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/saucercreek",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },

    // NEBRASKA  ---------------------------------------------------------------------------------------------------------
    /* {
         bodyOfWater: "McConaughy", // lake name
         state: ["Nebraska"],
         data: [],
         refreshInterval: 90, //minutes
         lastRefresh: "12/31/18", // a Date 
         seaLevelDelta: 547.0, // data reported as a delta to Full Pool -100
         normalPool: 647.0,
         lat: 41.211586,
         long: -101.670503,
         elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=45872030&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
         flowURL: "",
         href: "/lakes/mcconaughy",
         dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
     },*/

    // NEVADA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Mojave", // lake name
        state: ["Nevada"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 547.0, // data reported as a delta to Full Pool -100
        normalPool: 647.0,
        lat: 35.421721,
        long: -114.632742,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09422500&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/mojave",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Wild Horse", // lake name
        state: ["Nevada"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 6208.0,
        lat: 41.656400,
        long: -115.799095,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=13174000&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/wildhorse",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },

    // NEW JERSEY  ---------------------------------------------------------------------------------------------------------

    {
        bodyOfWater: "Boonton", // lake name
        state: ["New Jersey"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 305.5,
        lat: 40.876346,
        long: -74.411533,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01380900&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/boonton",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Oradell", // lake name
        state: ["New Jersey"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 21.0,
        lat: 40.963163,
        long: -74.018331,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01378480&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/oradell",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Spruce Run", // lake name
        state: ["New Jersey"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 255.0,
        lat: 40.662778,
        long: -74.938889,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01396790&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/sprucerun",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Swimming Rvr", // lake name
        state: ["New Jersey"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 34.5,
        lat: 40.318890,
        long: -74.118060,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01396790&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/swimmingrvr",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Tappan", // lake name
        state: ["New Jersey"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 56.0,
        lat: 32.572133,
        long: -104.388761,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01376950&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/tappan",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Wanaque", // lake name
        state: ["New Jersey"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 302.0,
        lat: 32.572133,
        long: -104.388761,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01386990&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/wanaque",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Woodcliff", // lake name
        state: ["New Jersey"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min 
        seaLevelDelta: 0,
        normalPool: 98.0,
        lat: 41.055357,
        long: -74.299193,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01377450&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/woodcliff",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },

    // NEW MEXICO  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Brantley", // lake name
        state: ["New Mexico"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 3271.0,
        lat: 32.572133,
        long: -104.388761,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=17043&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/brantley",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Conchas", // lake name
        state: ["New Mexico"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 4201.0,
        lat: 35.388492,
        long: -104.193425,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=33043&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/conchas",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },

    {
        bodyOfWater: "Elephant Butte", // lake name
        state: ["New Mexico"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 4301.0,
        lat: 33.212019,
        long: -107.192382,
        elevURL: "https://waterdatafortexas.org/reservoirs/individual/elephant-butte-30day.csv",
        flowURL: "",
        href: "/lakes/elephantbutte",
        dataSource: ["TWDB", "loadAds"], // array of calls to make to retrieve data Texas Water Development District
    },
    {
        bodyOfWater: "Ft Sumner", // lake name
        state: ["New Mexico"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 4231.0,
        normalPool: 4278.0,
        lat: 34.625466,
        long: -104.389870,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08384000&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/ftsumner",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Santa Rosa", // lake name
        state: ["New Mexico"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 4749.35,
        lat: 35.043518,
        long: -104.675664,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=261043&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/santarosa",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ute", // lake name
        state: ["New Mexico"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 3784.91,
        lat: 35.349691,
        long: -103.459605,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07226800&period=PT168H&parameterCd=62615&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/ute",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },

    // NEW YORK  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Champlain", // lake name
        state: ["New York", "Vermont"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 95.50,
        lat: 44.561815,
        long: -73.363063,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04294413&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/champlain",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Oneida", // lake name
        state: ["New York"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 370.0,
        lat: 43.190682,
        long: -75.841113,
        elevURL: "/api/alabama",
        flowURL: "",
        href: "/lakes/oneida",
        dataSource: ["USLAKES", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ontario", // lake name
        state: ["New York"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 95.50,
        lat: 44.561815,
        long: -73.363063,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04220259&period=Pt168H&parameterCd=72214&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/ontariony",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },

    // NORTH CAROLINA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Badin", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 541.1,
        lat: 35.45,
        long: -80.11,
        cubeCheck: "badin",
        elevURL: "",
        flowURL: "",
        href: "/lakes/badin",
        dataSource: ["CUBE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Belews", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 722.0,
        lat: 36.315758,
        long: -80.028425,
        elevURL: "",
        flowURL: "",
        href: "/lakes/belews",
        dataSource: ["loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Blewett Falls", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 78.0,
        normalPool: 178.0,
        lat: 35.0,
        long: -79.90,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/30.txt",
        flowURL: "",
        href: "/lakes/blewettfalls",
        dataSource: ["DUKE", "loadAds"], // array of calls to make to retrieve data
    },
    //Found this on ACE. Format is different for streams (smh), there is no .elev, it is .stage will add later 
    {
        bodyOfWater: "Cape Fear River (Fayett)", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 0.0,
        lat: 35.05,
        long: -78.857,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=29041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/capefearfayett",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Falls", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 251.5,
        topOfFloodControl: 264.8,
        lat: 36.01,
        long: -78.70,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1745041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        tempURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02087182&period=Pt168H&parameterCd=00010&siteType=LK&siteStatus=all",
        href: "/lakes/falls",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Fontana", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 1703.0,
        lat: 35.442211,
        long: -83.707785,
        elevURL: "https://soa.tva.gov/api/river/observed-data/FONN7",
        flowURL: "",
        href: "/lakes/fontana",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Gaston", // lake name
        state: ["North Carolina", "Virginia"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 200.0,
        lat: 36.51,
        long: -77.94,
        elevURL: "http://epec.saw.usace.army.mil/dailyrep.txt",
        flowURL: "",
        href: "/lakes/gaston",
        dataSource: ["ACEWilm", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Hickory", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 835.0,
        normalPool: 935.0,
        lat: 35.80,
        long: -81.27,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/13.txt",
        flowURL: "",
        href: "/lakes/hickory",
        dataSource: ["DUKE", "loadAds"], // array of calls to make to retrieve data
    },

    {
        bodyOfWater: "High Rock", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 655.2,
        lat: 35.63,
        long: -80.27,
        elevURL: "",
        flowURL: "",
        href: "/lakes/highrock",
        dataSource: ["CUBE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Hyco", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 410.0,
        lat: 36.49,
        long: -79.08,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02077280&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/hyco",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Jocassee", // lake name
        state: ["North Carolina", "South Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1000.0,
        normalPool: 1100.0,
        lat: 34.98,
        long: -82.94,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/9.txt",
        flowURL: "",
        href: "/lakes/jocassee",
        dataSource: ["DUKE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Jordan", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 216.0,
        topOfFloodControl: 240.0,
        botOfFloodConservation: 202.0,
        lat: 35.75,
        long: -79.03,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1743041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/jordan",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Kerr", // lake name
        state: ["North Carolina", "Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 300.0,
        topOfFloodControl: 320.0,
        topOfDam: 332.0,
        lat: 36.56,
        long: -78.32,
        //elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02079490&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1749041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/kerr",
        //dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Mayo", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 0.0,
        lat: 36.527172,
        long: -78.871988,
        elevURL: "none",
        flowURL: "",
        href: "/lakes/mayo",
        dataSource: ["loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Neuse River (Kinston)", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 10.90,
        normalPool: 10.90,
        lat: 35.26,
        long: -77.585,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02089500&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/neuse",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Norman", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 1298.0, // data reported as a delta to full pool = 100
        normalPool: 1398.0,
        lat: 35.49,
        long: -80.94,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/4.txt",
        flowURL: "",
        href: "/lakes/norman",
        dataSource: ["DUKE", "loadAds"], // array of calls to make to retrieve data
    },
    /* {
         bodyOfWater: "Randleman", // lake name
         state: ["North Carolina"],
         data: [],
         refreshInterval: 1450, //minutes
         lastRefresh: "12/31/18", // a Date 
         seaLevelDelta: 0.0, // data reported as a delta to full pool = 100
         normalPool: 682.0,
         lat: 35.847430,
         long: -79.829711,
         elevURL: "",
         flowURL: "",
         href: "/lakes/randleman",
         dataSource: ["loadAds"], // array of calls to make to retrieve data
     },*/
    {
        bodyOfWater: "Rhodhiss", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 885.0,
        normalPool: 985.0,
        lat: 35.78,
        long: -81.53,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/14.txt",
        flowURL: "",
        href: "/lakes/rhodhiss",
        dataSource: ["DUKE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Roanoke Rapids", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 131.0,
        lat: 36.483629,
        long: -77.704501,
        elevURL: "http://epec.saw.usace.army.mil/dailyrep.txt",
        flowURL: "",
        href: "/lakes/roanokerapids",
        dataSource: ["ACEWilm", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Roanoke River (Halifax)", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 0,
        lat: 36.332777,
        long: -77.581685,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=0208062765&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/roanokehfax",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Roanoke River (Hwy 45)", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 0,
        lat: 35.914,
        long: -76.722,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=0208114150&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/roanoke45",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Roanoke River (Roanoke Rapids)", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 43.84,
        normalPool: 0.0,
        lat: 36.479291,
        long: -77.662224,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02080500&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/roanokervrrap",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Roanoke River (Scotland Neck)", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 5.77,
        normalPool: 0,
        lat: 36.208942,
        long: -77.382983,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02081000&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/roanokescot",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Roanoke River (Williamston)", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: -2.86,
        normalPool: 0,
        lat: 35.862824,
        long: -77.044173,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02081054&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/roanokewill",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Shearon Harris", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 0.0,
        lat: 35.594526,
        long: -78.961252,
        elevURL: "none",
        flowURL: "",
        href: "/lakes/shearonharris",
        dataSource: ["loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Tillery", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 178.0,
        normalPool: 278.0,
        lat: 35.23,
        long: 80.08,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/31.txt",
        flowURL: "",
        href: "/lakes/tillery",
        dataSource: ["DUKE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Tuckertown", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 596.0,
        lat: 35.53,
        long: -80.198,
        elevURL: "",
        flowURL: "",
        href: "/lakes/tuckertown",
        dataSource: ["CUBE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "W Scott Kerr", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 1030.0,
        topOfFloodControl: 1075.0,
        lat: 36.133598,
        long: -81.226699,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1747041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/wscottkerr",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Wylie", // lake name
        state: ["North Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 400.0,
        normalPool: 500.0,
        lat: 35.08,
        long: -81.06,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/18.txt",
        flowURL: "",
        href: "/lakes/wylie",
        dataSource: ["DUKE", "loadAds"], // array of calls to make to retrieve data
    },

    /*{
        bodyOfWater: "Indian Lake", // lake name
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 900.7,
        lat: 39.082309,
        long: -84.872313,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03260500&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/indianoh",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },*/


    // OHIO  ---------------------------------------------------------------------------------------------------------

    {
        bodyOfWater: "Ohio River (Cincy)", // lake name
        state: ["Ohio"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 25.4,
        lat: 39.094311,
        long: -84.510556,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03255000&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/ohiorivercin",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ohio River (Tanners)", // lake name
        state: ["Ohio"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 25.4,
        lat: 39.082309,
        long: -84.872313,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03276650&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/ohiorivertan",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Misquito Lake", // lake name
        state: ["Ohio"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 900.7,
        lat: 41.348051,
        long: -80.753973,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03095000&period=PT168H&parameterCd=62615&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/misquito",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },

    // OKLAHOMA  ---------------------------------------------------------------------------------------------------------

    {
        bodyOfWater: "Copan", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 710.0,
        topOfFloodControl: 732.0,
        topOfDam: 745.0,
        lat: 36.892862,
        long: -95.964192,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5338051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/copan",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ellsworth", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1232.50,
        topOfFloodControl: 1240.0, // guess
        lat: 34.822983,
        long: -98.354524,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07308990&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/ellsworth",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Eufaula (OK)", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 585.0,
        topOfFloodControl: 597.0,
        lat: 35.294172,
        long: -95.547248,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1882051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/eufaulaok",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Eucha", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 778.0,
        topOfFloodControl: 790.0, // guess
        lat: 36.364810,
        long: -94.914365,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07191285&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/eucha",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ft Gibson", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 554.0,
        topOfFloodControl: 582.0,
        lat: 35.967182,
        long: -95.285279,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=3690051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/ftgibson",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Grand", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 742.0,
        topOfFloodControl: 755.0,
        lat: 36.552084,
        long: -94.905543,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=3770051&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/grand",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Hudson", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 2, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 619.0,
        topOfFloodControl: 636.0,
        lat: 36.251656,
        long: -95.151576,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07191400&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/hudson",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Hulah", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 733.0,
        topOfFloodControl: 765.0,
        lat: 36.927736,
        long: -96.112751,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5316051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/hulah",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Kaw", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1010.0,
        topOfFloodControl: 1044.5,
        lat: 36.731611,
        long: -96.907271,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5294051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/kaw",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Keystone", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 723.0,
        topOfFloodControl: 754.0,
        topOfDam: 771.0,
        lat: 36.168618,
        long: -96.268313,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5502051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/keystone",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Lawtonka", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1343.0,
        topOfFloodControl: 1360.0, // guess
        lat: 34.746575,
        long: -98.497717,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07309500&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/lawtonka",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "McGee Creek", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 577.1,
        topOfFloodControl: 595.5,
        lat: 34.336223,
        long: -95.887650,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1550051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/mcgee",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Oologah", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 638.0,
        topOfFloodControl: 661.0,
        lat: 36.543770,
        long: -95.603535,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5368051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/oologah",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Robert S Kerr", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 460.0,
        topOfFloodControl: 475.0, // guess
        lat: 35.352318,
        long: -94.858836,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5457051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/robertkerr",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Skiatook", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 714.0,
        topOfFloodControl: 729.0,
        lat: 36.375804,
        long: -96.178646,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=5117051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/skiatook",
        dataSource: ["ACE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Tenkiller", // lake name
        state: ["Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 632.0,
        topOfFloodControl: 667.0,
        lat: 35.650108,
        long: -94.994100,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=3660051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/tenkiller",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },

    // OREGON  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Lost Creek", // lake name
        state: ["Oregon"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 1812.0,
        topOfFloodControl: 1872.0,
        lat: 42.683351,
        long: -122.656166,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=48202029&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN",
        flowURL: "",
        href: "/lakes/lostcreek",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Klamath", // lake name
        state: ["Oregon"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0, // 1329ft but data reported as a delta to full pool
        normalPool: 4140.0,
        lat: 42.392222,
        long: -121.880278,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=11507001&period=PT168H&parameterCd=62615&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/klamath",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    // PENNSYLVANIA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Curwensville", // lake name
        state: ["Pennsylvania"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1162.0,
        lat: 40.949700,
        long: -78.529598,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01541180&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/curwensville",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Raystown", // lake name
        state: ["Pennsylvania"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 786.0,
        lat: 40.379739,
        long: -78.058422,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01563100&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/raystown",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Shenango", // lake name
        state: ["Pennsylvania"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 894.67,
        lat: 41.290985,
        long: -80.429697,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=03103400&period=PT168H&parameterCd=62615&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/shenango",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },

    // SOUTH CAROLINA  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Clarks Hill", // lake name
        state: ["South Carolina", "Georgia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 330.0,
        lat: 33.75,
        long: -82.25,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02193900&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/clarkshill",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Cooper River", // lake name
        state: ["South Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: -6.38, // Cooper River gage height is -6.38, it's a strange USGS site
        normalPool: 0.0,
        lat: 32.84,
        long: -79.93,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02172053&period=PT168H&parameterCd=00065&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/cooperriver",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Hartwell", // lake name
        state: ["South Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 660.0,
        lat: 34.41,
        long: -82.85,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02187010&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/hartwell",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Keowee", // lake name
        state: ["South Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 700.0,
        normalPool: 800.0,
        lat: 34.76,
        long: -82.93,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/10.txt",
        flowURL: "",
        href: "/lakes/Keowee",
        dataSource: ["DUKE"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Murray", // lake name
        state: ["South Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 360.0,
        lat: 34.06,
        long: -81.29,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02168500&period=PT168H&parameterCd=00062&siteType=ST&siteStatus=all",
        flowURL: "", // Until I can fix it "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02168504&period=PT168H&parameterCd=00060&siteType=ST&siteStatus=all",
        href: "/lakes/murray",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Santee (Marion)", // lake name
        state: ["South Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 76.8,
        lat: 33.52,
        long: -80.45,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02171000&period=PT168H&parameterCd=00062&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/santee1",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Santee (Moultrie)", // lake name
        state: ["South Carolina"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 75.5,
        lat: 33.32,
        long: -80.06,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02172000&period=PT168H&parameterCd=00062&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/santee2",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Wateree", // lake name
        state: ["South Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 125,
        normalPool: 225.0,
        lat: 34.41,
        long: 80.79,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/17.txt",
        flowURL: "",
        href: "/lakes/wateree",
        dataSource: ["DUKE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Wylie", // lake name
        state: ["South Carolina"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 400.0,
        normalPool: 500.0,
        lat: 35.08,
        long: -81.06,
        elevURL: "https://lakes.duke-energy.com/Data/Detail/3_Month/18.txt",
        flowURL: "",
        href: "/lakes/wylie",
        dataSource: ["DUKE", "loadAds"], // array of calls to make to retrieve data
    },

    // SOUTH Dakota  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Belle Fouche", // lake name
        state: ["South Dakota"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 2900.0,
        normalPool: 2964.0,
        topOfFlood: 2975.0,
        topOfDam: 2989.75,
        lat: 33.75,
        long: -82.25,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=06435000&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/clarkshill",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    // TENNESSEE  ---------------------------------------------------------------------------------------------------------
    
    // No data yet for Little Bear
    /*{
        bodyOfWater: "Big Bear", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 651.0,
        lat: 34.399166,
        long: -87.987778,
        elevURL: "https://soa.tva.gov/api/river/observed-data/BCRT1",
        flowURL: "",
        href: "/lakes/bigbear",
        dataSource: ["TVA"], // array of calls to make to retrieve data
    },*/
    {
        bodyOfWater: "Center Hill", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 648.0,
        topOfFloodControl: 685.0,
        topOfDam: 696.0,
        lat: 36.095028,
        long:  -85.825874,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=2915010&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/centerhill",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Cherokee", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1073.0,
        lat: 36.16888809,
        long: -83.5008316,
        elevURL: "https://soa.tva.gov/api/river/observed-data/CRKT1",
        flowURL: "",
        href: "/lakes/cherokee",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    }, {
        bodyOfWater: "Chickamauga", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 682.0,
        lat: 35.229058,
        long: -85.077891,
        elevURL: "https://soa.tva.gov/api/river/observed-data/CKDT1",
        flowURL: "",
        href: "/lakes/chickamauga",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Douglas", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 990.0,
        lat: 35.998267,
        long: -83.380776,
        elevURL: "https://soa.tva.gov/api/river/observed-data/DUGT1",
        flowURL: "",
        href: "/lakes/douglas",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Dale Hollow", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 651.0,
        lat: 36.594828,
        long: -85.363089,
        elevURL: "https://soa.tva.gov/api/river/observed-data/DLHT1",
        flowURL: "",
        href: "/lakes/dalehollow",
        dataSource: ["TVA"], // array of calls to make to retrieve data
    },
    // No data yet for Little Bear
    /*{
        bodyOfWater: "Little Bear", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 620.0,
        lat: 34.454667,
        long:  -87.974812,
        elevURL: "https://soa.tva.gov/api/river/observed-data/LBRAT1",
        flowURL: "",
        href: "/lakes/littlebear",
        dataSource: ["TVA"], // array of calls to make to retrieve data
    },*/
    {
        bodyOfWater: "Nickajack", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 633.5,
        lat: 35.022662,
        long: -85.544745,
        elevURL: "https://soa.tva.gov/api/river/observed-data/NKJT1",
        flowURL: "",
        href: "/lakes/nicakjack",
        dataSource: ["TVA"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Norris", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1020.5,
        lat: 36.22305679,
        long: -84.08999634,
        elevURL: "https://soa.tva.gov/api/river/observed-data/NRST1",
        flowURL: "",
        href: "/lakes/norris",
        dataSource: ["TVA"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Old Hickory", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 445.5,
        lat: 36.29777908,
        long: -86.65499878,
        elevURL: "https://soa.tva.gov/api/river/observed-data/OHHT1",
        flowURL: "",
        href: "/lakes/oldhickory",
        dataSource: ["TVA"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Percy Priest", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 489.0,
        lat: 36.124047,
        long: -86.600873,
        elevURL: "https://soa.tva.gov/api/river/observed-data/JPHT1",
        flowURL: "",
        href: "/lakes/percypriest",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "South Holston", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1729.0,
        lat: 36.52027893,
        long: -82.09527588,
        elevURL: "https://soa.tva.gov/api/river/observed-data/SHDT1",
        flowURL: "",
        href: "/lakes/southholston",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Tellico", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 814.0,
        lat: 35.735481,
        long: -84.248521,
        elevURL: "https://soa.tva.gov/api/river/observed-data/TDTT1",
        flowURL: "",
        href: "/lakes/tellico",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Tims Ford", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 889.0,
        lat: 35.215233,
        long: -86.240669,
        elevURL: "https://soa.tva.gov/api/river/observed-data/TMFT1",
        flowURL: "",
        href: "/lakes/timsford",
        dataSource: ["TVA"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Watts Bar", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 741.0,
        lat: 35.691108,
        long: -84.726450,
        elevURL: "https://soa.tva.gov/api/river/observed-data/WBOT1",
        flowURL: "",
        href: "/lakes/wattsbar",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Watauga", // lake name
        state: ["Tennessee"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 741.0,
        lat: 36.32916641,
        long: -82.12527466,
        elevURL: "https://soa.tva.gov/api/river/observed-data/WTGT1",
        flowURL: "",
        href: "/lakes/watauga",
        dataSource: ["TVA", "loadAds"], // array of calls to make to retrieve data
    },

    // TEXAS  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Amistad", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1117.0,
        lat: 29.464076,
        long: -101.055931,
        elevURL: "https://waterdatafortexas.org/reservoirs/individual/amistad-30day.csv",
        flowURL: "",
        href: "/lakes/amistad",
        dataSource: ["TWDB", "loadAds"], // array of calls to make to retrieve data Texas Water Development District
    },
    {
        bodyOfWater: "Cedar Creek", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 322.0,
        lat: 32.250180,
        long: -96.117778,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08063010&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/cedarcreek",
        dataSource: ["USGS"], // array of calls to make to retrieve data Texas Water Development District
    },
    {
        bodyOfWater: "Conroe", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 201.0,
        lat: 30.387607,
        long: -95.574936,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08067600&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/conroe",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Falcon", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 301.10,
        lat: 26.779704,
        long: -99.225982,
        elevURL: "https://waterdatafortexas.org/reservoirs/individual/falcon-30day.csv",
        flowURL: "",
        href: "/lakes/falcon",
        dataSource: ["TWDB", "loadAds"], // array of calls to make to retrieve data Texas Water Development District
    },
    {
        bodyOfWater: "Fork", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 403.0,
        lat: 32.826972,
        long: -95.572361,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08018800&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/fork",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "LBJ", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 825.40,
        lat: 30.558502,
        long: -98.350450,
        elevURL: "https://waterdatafortexas.org/reservoirs/individual/lyndon-b-johnson-30day.csv",
        flowURL: "",
        href: "/lakes/LBJ",
        dataSource: ["TWDB"], // array of calls to make to retrieve data Texas Water Development District
    },
    {
        bodyOfWater: "Palestine", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 344.0,
        lat: 31.130035,
        long: -94.210815,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08031400&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/palestine",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Ray Roberts", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 632.5,
        lat: 33.369670,
        long: -97.047413,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=432048&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/rayroberts",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Rayburn", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 164.40,
        lat: 31.130035,
        long: -94.210815,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08039300&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/rayburn",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Tawakoni", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 436.0,
        lat: 32.835944,
        long: -95.936837,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08017400&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/tawakoni",
        dataSource: ["USGS"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Toledo Bend", // lake name
        state: ["Texas", "Louisiana"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 172.0,
        lat: 31.499501,
        long: -93.739995,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08025350&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/toledobend",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Texoma", // lake name
        state: ["Texas", "Oklahoma"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 617.0,
        topOfFloodControl: 640.0,
        lat: 33.914060,
        long: -96.629444,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=2063051&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/texoma",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Travis", // lake name
        state: ["Texas"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 681.0,
        lat: 30.410029,
        long: -97.906123,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=203048&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/travis",
        dataSource: ["ACE"], // array of calls to make to retrieve data 
    },

    // UTAH ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Deer Creek", // lake name
        state: ["Utah"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 803.61,
        lat: 38.040028,
        long: -111.382762,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=868108&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/deercreek",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },

    // Vermont  ---------------------------------------------------------------------------------------------------------
    // Champlain found under New York
    {
        bodyOfWater: "Memphremagog", // lake name
        state: ["Vermont"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 679.0,
        lat: 44.3865,
        long: -72.7622,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04295500&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/memphremagog",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Waterbury", // lake name
        state: ["Vermont"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 591.0,
        lat: 44.3865,
        long: -72.7622,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04288500&period=PT168H&parameterCd=62614&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/waterbury",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },

    // VIRGINIA ---------------------------------------------------------------------------------------------------------
    // Kerr found under North Carolina
    {
        bodyOfWater: "James River (Jamestown Ferry Pier)", // lake name
        state: ["Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 0,
        lat: 36.96,
        long: -76.36,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=02042770&period=PT168H&parameterCd=62620&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/james",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Leesville", // lake name
        state: ["Virginia"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 620.0,
        lat: 36.96,
        long: -76.36,
        elevURL: "http://epec.saw.usace.army.mil/dailyrep.txt",
        flowURL: "",
        href: "/lakes/leesville",
        dataSource: ["ACEWilm", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Philpott", // lake name
        state: ["Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        elevDataInterval: 4, // Time between elevation data 4 = 15min, 2 = 30 min 1 = 60 min
        seaLevelDelta: 0,
        normalPool: 974.0,
        lat: 36.798966,
        long: -80.050794,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=1753041&p_parameter_type=Flow%3AStor%3APrecip%3AStage%3AElev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/philpott",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Potomac River (Alexandria)", // lake name
        state: ["Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 0,
        lat: 38.79,
        long: -77.04,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=0165258890&period=PT168H&parameterCd=62620&siteType=ST&siteStatus=all",
        flowURL: "",
        href: "/lakes/potomac",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Smith Mountain", // lake name
        state: ["Virginia"],
        data: [],
        refreshInterval: 1450, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 795.0,
        lat: 37.05,
        long: -79.60,
        elevURL: "http://epec.saw.usace.army.mil/dailyrep.txt",
        flowURL: "",
        href: "/lakes/smithmountain",
        dataSource: ["ACEWilm", "loadAds"], // array of calls to make to retrieve data
    },

    // WEST VIRGINIA ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Bluestone", // lake name
        state: ["West Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 1406.0,
        lat: 37.612123,
        long: -80.919781,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=253108&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/bluestone",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Burnsville", // lake name
        state: ["West Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 776.0,
        lat: 38.830378,
        long: -80.618509,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=459108&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/burnsville",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Stonewall Jackson", // lake name
        state: ["West Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 1067.53,
        lat: 38.999310,
        long: -80.475742,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=17130111&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/stonewalljackson",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Sutton", // lake name
        state: ["West Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 895.0,
        lat: 38.656194,
        long: -80.684586,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=259108&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/sutton",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Summersville", // lake name
        state: ["West Virginia"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0,
        normalPool: 1575.0,
        lat: 38.227544,
        long: -80.886351,
        elevURL: "http://water.usace.army.mil/a2w/CWMS_CRREL.cwms_data_api.get_report_json?p_location_id=264108&p_parameter_type=Flow:Stor:Precip:Stage:Elev&p_last=5&p_last_unit=days&p_unit_system=EN&p_format=JSON",
        flowURL: "",
        href: "/lakes/summersville",
        dataSource: ["ACE", "loadAds"], // array of calls to make to retrieve data
    },

    // WISCONSIN  ---------------------------------------------------------------------------------------------------------
    {
        bodyOfWater: "Geneva", // lake name
        state: ["Wisconsin"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 0.0,
        normalPool: 879.0,
        lat: 42.569355,
        long: -88.458597,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=423525088260400&period=PT168H&parameterCd=62615&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/geneva",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    },
    {
        bodyOfWater: "Winnebago", // lake name
        state: ["Wisconsin"],
        data: [],
        refreshInterval: 90, //minutes
        lastRefresh: "12/31/18", // a Date 
        seaLevelDelta: 746.0,
        normalPool: 746.0,
        lat: 44.027742,
        long: -88.447058,
        elevURL: "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04082500&period=PT168H&parameterCd=00065&siteType=LK&siteStatus=all",
        flowURL: "",
        href: "/lakes/winnebago",
        dataSource: ["USGS", "loadAds"], // array of calls to make to retrieve data
    }
]