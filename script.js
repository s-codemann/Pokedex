let offset = 0;
let limit = 29;
let searchedPoks = [];
let DEPoks = [];
searchMode = false;
const main = document.getElementById("main");
function getPoks(event, searchoffset, searcharr) {
  console.log(searchoffset ? searchoffset : "false");
  let funcoffset = offset;
  let funclimit = limit;

  console.log("offset:", offset, "limit:", limit);
  if (searchoffset) {
    funcoffset = searchoffset;
    funclimit = 1;
  } else {
    funcoffset = funcoffset;
  }
  fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${funclimit}&offset=${funcoffset}`
  )
    .then((res) => res.json())
    .then((data) => {
      data.results.forEach((pokemon) => {
        let cont = document.createElement("div");
        cont.classList.add("poke-cont");
        let picture = document.createElement("img");
        picture.classList.add("profile-pic");
        let description = document.createElement("p");
        description.classList.add("d_none");
        let evoChain;
        let stats;
        let name = document.createElement("span");
        name.className = "name";
        fetch(pokemon.url)
          .then((res) => res.json())

          .then((thisPok) => {
            cont.id = thisPok.name;
            picture.src = thisPok.sprites.front_default;
            // picture.src = thisPok.sprites.other.home.front_default;
            stats = thisPok.stats.map((curstat) => [
              curstat.stat.name,
              curstat.base_stat,
            ]);
            fetch(thisPok.species.url)
              .then((res) => res.json())
              .then((species) => {
                let statCont = document.createElement("div");
                statCont.classList.add("all-stats", "d_none");

                stats.forEach((stat) => {
                  let thisCont = document.createElement("div");
                  let thistext = document.createElement("h5");
                  switch (stat[0]) {
                    case "attack":
                      thistext.textContent = "ATK : " + stat[1];
                      break;
                    case "defense":
                      thistext.textContent = "DEF : " + stat[1];
                      break;
                    case "special-attack":
                      thistext.textContent = "SPA : " + stat[1];
                      break;
                    case "special-defense":
                      thistext.textContent = "SPD : " + stat[1];
                      break;
                    case "hp":
                      thistext.textContent = "HP : " + stat[1];
                      break;
                    case "speed":
                      thistext.textContent = "SPE : " + stat[1];
                      break;

                    default:
                      thistext.textContent = stat[0];
                  }
                  thistext.title = stat[0];
                  thisCont.classList.add("single-stat-cont");
                  let thisStatBar = document.createElement("div");
                  thisStatBar.classList.add("stat-bar");
                  let thisStat = document.createElement("div");

                  thisStat.classList.add("stat");
                  thisStat.style.width = `${(stat[1] / 255) * 100}%`;
                  thisStatBar.append(thisStat);
                  thisCont.append(thistext, thisStatBar);
                  statCont.append(thisCont);
                });
                cont.append(statCont);
                cont.style.backgroundColor = species.color.name;
                cont.style.boxShadow = "0 0 20px 8px " + species.color.name;
                cont.style.backgroundColor = getComputedStyle(
                  cont
                ).backgroundColor.replace(")", ",0.5)");

                evoChain = fetchEvos(species.id);
                name.textContent = species.names.find(
                  (namel) => namel.language.name === "de"
                ).name;
                description.textContent = species.flavor_text_entries.find(
                  (entry) => entry.language.name === "de"
                ).flavor_text;

                //   name.textContent = species.names.find(
                //     (entry) => entry.languages.name === "de"
                //   ).name;
                cont.append(picture, name, description);
                cont.addEventListener("click", (ev) => {
                  cont.classList.toggle("big");
                  cont.scrollIntoView(true);
                  console.log(ev.target.children.length);
                  if (cont.children.length < 5) {
                    let evoCont = document.createElement("div");
                    evoCont.classList.add("evo-cont");

                    if (evoChain.length > 1) {
                      fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
                        .then((res) => res.json())
                        .then((evosearch) => {
                          evoChain.forEach((evoStep) => {
                            let evopic = document.createElement("img");
                            let evopicDiv = document.createElement("div");
                            evopic.title = evoStep;
                            evopicDiv.classList.add("evopic-div");
                            fetch(
                              evosearch.results.find(
                                (entry) => entry.name === evoStep.toString()
                              ).url
                            )
                              .then((res) => res.json())
                              .then(
                                (foundevo) =>
                                  (evopic.src = foundevo.sprites.front_default)
                              );

                            evopicDiv.append(evopic);
                            evopicDiv.addEventListener("click", () => {
                              clonemain(ev, evoStep.toString());
                            });
                            evoCont.append(evopicDiv);
                          });
                        });

                      let evoHeading = document.createElement("h4");
                      evoHeading.textContent = "Evolutionen";

                      let contWHeading = document.createElement("div");
                      contWHeading.classList.add("headingcont");
                      contWHeading.append(evoHeading, evoCont);
                      cont.append(contWHeading);
                    }
                    //
                    let hwDiv = document.createElement("div");
                    let height = document.createElement("div");
                    let weight = document.createElement("div");
                    height.classList.add("height");
                    weight.classList.add("weight");
                    let weightIMG = document.createElement("img");
                    let heightIMG = document.createElement("img");
                    heightIMG.src = "img/height.png";
                    weightIMG.src = "img/weight.png";
                    let heightSpan = document.createElement("span");
                    height.title = "Größe";
                    weight.title = "Gewicht";
                    let weightSpan = document.createElement("span");
                    heightSpan.textContent = `${thisPok.height / 10} m`;
                    weightSpan.textContent = `${thisPok.weight / 10} kg`;
                    weight.append(weightSpan, weightIMG);
                    height.append(heightSpan, heightIMG);
                    hwDiv.append(height, weight);

                    hwDiv.className = "height-weight";
                    description.append(hwDiv);
                  }
                  console.log(ev.target.children.length);
                  Array.from(cont.children).forEach((elem) =>
                    elem.classList.remove("d_none")
                  );

                  if (
                    !Array.from(cont.children).some((child) =>
                      Array.from(child.classList).includes("d_none")
                    )
                  ) {
                    Array.from(cont.children).forEach((child) => {
                      console.log(child.classList, child.localName);
                      if (
                        child.localName !== "span" &&
                        child.localName !== "img" &&
                        !cont.classList.contains("big")
                      ) {
                        child.classList.add("d_none");
                      }
                    });
                  }
                });
              });
          });

        searchoffset ? searcharr.append(cont) : main.append(cont);
      });
    });
  searchoffset ? (offset = offset) : (offset += limit);
  if (DEPoks.length === 0) {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=1500`)
      .then((res) => res.json())
      .then((data) => {
        data.results
          .filter((pok) => !pok.name.includes("-"))
          .map((engpok) => {
            fetch(engpok.url)
              .then((res) => res.json())
              .then((fetchedpok) => {
                fetch(fetchedpok.species.url)
                  .then((res) => res.json())
                  .then((fetchedspecie) => {
                    let deName = fetchedspecie.names.find(
                      (name) => name.language.name === "de"
                    ).name;

                    DEPoks.push({ name: deName, engName: "", url: engpok.url });
                  });
              });
          });
      })
      .catch((err) => console.error(err));
  }
}
function search() {
  Array.from(document.querySelectorAll(".poke-cont")).forEach((cont) => {
    console.log(cont.children);
    cont.children[2].textContent
      .toLowerCase()
      .startsWith(document.querySelector("input").value.toLowerCase())
      ? (cont.style.display = "flex")
      : (cont.style.display = "none");
  });
}
document.querySelector("input").addEventListener("input", clonemain);

function fetchEvos(pokeIndex) {
  let arr = [];

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokeIndex}/`)
    .then((res) => res.json())
    .then((data) => {
      fetch(data.species.url)
        .then((res) => res.json())
        .then((specie) => {
          fetch(specie.evolution_chain.url)
            .then((res) => res.json())
            .then((evo) => {
              arr.push([evo.chain.species.name]);
              if (evo.chain.evolves_to[0]) {
                arr.push(
                  evo.chain.evolves_to.map((entry) => entry.species.name)
                );

                if (evo.chain.evolves_to[0].evolves_to[0]) {
                  arr.push(
                    evo.chain.evolves_to[0].evolves_to.map(
                      (entry) => entry.species.name
                    )
                  );
                }
              }
            });
        });
    });

  return arr;
}

function noDups(arr) {
  return arr
    .map((el, ind, ar) => {
      if (ar.indexOf(el) !== ar.lastIndexOf(el) && ind !== ar.indexOf(el)) {
        return;
      } else return el;
    })
    .filter((el) => el !== undefined);
}
const body = document.body;

window.addEventListener("load", getPoks);
window.addEventListener("scroll", (ev) => {
  if (
    document.body.clientHeight - (window.scrollY + window.innerHeight) < 50 &&
    document.querySelector("main").children.length > 20
  ) {
    getPoks();
  }
});

async function clonemain(ev, evoName) {
  console.log(evoName, typeof evoName);
  let tess = main.cloneNode(false);
  tess.id = "searchMain";
  let link;
  if (document.querySelector("searchMain")) {
    document.querySelector("searchMain").remove();
  }

  let arr = [];
  await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${10000}`)
    .then((res) => res.json())
    .then((allpk) => {
      if (evoName) {
        allpk.results
          .filter(
            (pok, index, results) =>
              pok.name === evoName &&
              results.indexOf(pok) ===
                results.findIndex((comp) => comp.name === pok.name)
          )
          .forEach((foundPok) =>
            getPoks(null, allpk.results.indexOf(foundPok), tess)
          );
      } else if (document.querySelector("input").value) {
        let noduparr = [];
        noDups(
          allpk.results.filter(
            (pok, index, results) =>
              pok.name.substring(
                0,
                document.querySelector("input").value.length
              ) === document.querySelector("input").value &&
              pok.name.includes("-") === false
          )
        ).forEach((foundPok) => {
          console.log(foundPok.name);
          noduparr.push(foundPok.name);
          if (
            noduparr.indexOf(
              foundPok.name === noduparr.lastIndexOf(foundPok.name)
            )
          ) {
            getPoks(null, allpk.results.indexOf(foundPok), tess);
          }
        });
      } else tess = main;
    });

  function logs() {
    console.log(searchedPoks);
  }
  setTimeout(logs, 35);

  searchedPoks.forEach((entry) => {
    console.log(entry, "mannometer");
  });
  console.log(tess, main);
  document.body.replaceChild(tess, document.querySelector("main"));

  // document.querySelectorAll("main")[1].style.display = "none";
  console.log(main);
}
function home() {
  document.querySelector("input").value = "";
  clonemain();
}
function filterJson(arr, json) {
  return json.map((entry) => {
    let object = {};

    arr.forEach((key) => (object[key] = entry[key]));
    return object;
  });
}
function filterJsonFor(json, arr) {}
