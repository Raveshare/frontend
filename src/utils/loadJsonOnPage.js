// --------
// Function to Load a specific json data on a specific/Active page of a canvas
// Params : store(built-in), json - json to be loaded
// --------

// From Anton | Discord
// https://discordapp.com/channels/782978534028214314/783479214364033034/1134550022839611414

import { randomId } from "./generateRandomId";

export const fnLoadJsonOnPage = (store, json) => {
  // if we don't have many pages, just load json directly
  if (store.pages.length <= 1) {
    // const updatedData = { ...json }; // Create a copy of the data

    // // Define the URL patterns to be replaced
    // const oldUrlPattern = "https://lenspost.s3.ap-south-1.amazonaws.com/";
    // const newUrl = "http://lenspost.b-cdn.net/";

    // // Iterate through each object in the "children" array
    // updatedData.pages[0]?.children.forEach((child) => {
    //   if (child?.src?.startsWith(oldUrlPattern)) {
    //     child.src = child.src.replace(oldUrlPattern, newUrl);
    //   }
    // });
    // console.log("The updated data is :", updatedData);
    store.loadJSON(json, true);
  } else {
    // other wise the logic is a bit more complicated
    // first take previous JSON
    // console.log(json);
    const oldJSON = JSON.parse(JSON.stringify(store.toJSON()));

    const deepCopyJson = JSON.parse(JSON.stringify(json));
    // not if size of new template is not the same as current store
    // we need to assign sizes of pages manually
    // console.log(oldJSON.width);
    // console.log(deepCopyJson.width);
    if (
      oldJSON.width !== deepCopyJson.width ||
      oldJSON.height !== deepCopyJson.height
    ) {
      // manually set width from store
      deepCopyJson.pages.forEach((page) => {
        page.width = deepCopyJson.width || page.width;
        page.height = deepCopyJson.height || page.height;
      });
    }
    // replace ids to make sure there is not duplicates
    // json.pages.forEach((page) => {

    deepCopyJson.pages.forEach((page) => {
      page.id = randomId(10);

      page.children.forEach((child) => {
        child.id = randomId(10);
      });
    });

    // console.log("The Deep copy JSON is :");
    // console.log(deepCopyJson);

    // then find data of active page
    const index = store.pages.indexOf(store.activePage);
    // then replace it in the new JSON
    oldJSON.pages.splice(index, 1, ...deepCopyJson.pages);
    // Try - Adding New ID to JSON
    // oldJSON.id = randomId(10);

    // now we can load the new JSON
    store.loadJSON(oldJSON, true);
    // console.log("The current loaded json is ");
    // console.log(oldJSON);
  }
};
