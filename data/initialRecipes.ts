import type { Recipe } from '../services/geminiService';

export const initialRecipes: Recipe[] = [
  {
    nazev: "Kuřecí nudličky s nivou a smetanou",
    popis: "Rychlý a chutný oběd nebo večeře, který kombinuje jemné kuřecí maso se smetanovou omáčkou a výraznou chutí nivy. Podáváme nejlépe s hranolky nebo rýží.",
    kategorie: "Masové jedlá",
    obrazek: "",
    ingredience: [
      "500g kuřecích prsou",
      "100g sýru Niva",
      "250ml smetany ke šlehání (33%)",
      "1 cibule",
      "2 stroužky česneku",
      "Olej",
      "Sůl, pepř",
      "Hladká mouka na zahuštění (volitelné)"
    ],
    postup: [
      "Kuřecí prsa nakrájíme na nudličky, osolíme a opepříme.",
      "Na pánvi rozehřejeme olej a maso zprudka orestujeme dozlatova.",
      "Maso vyjmeme z pánve. Na výpeku orestujeme nadrobno nakrájenou cibuli a prolisovaný česnek.",
      "Zalijeme smetanou, přidáme nastrouhanou nivu a necháme sýr rozpustit.",
      "Vrátíme maso do omáčky a krátce prohřejeme. Podle potřeby můžeme zahustit lžičkou hladké mouky rozmíchané v troše vody.",
      "Podáváme s oblíbenou přílohou."
    ]
  },
  {
    nazev: "Kuřecí maso v bramboráku",
    popis: "Vydatná a oblíbená česká klasika. Kuřecí směs zabalená v křupavém bramboráku, často podávaná se sýrem a tatarskou omáčkou.",
    kategorie: "Masové jedlá",
    obrazek: "",
    ingredience: [
      "400g kuřecích prsou",
      "1 cibule",
      "1 paprika (různé barvy)",
      "Žampiony (volitelné)",
      "Sůl, pepř, grilovací koření",
      "Olej",
      "Na bramborák: 500g brambor, 2 vejce, 3 stroužky česneku, 100g hladké mouky, Majoránka, sůl, pepř"
    ],
    postup: [
      "Maso nakrájíme na nudličky, okořeníme a orestujeme na oleji.",
      "Přidáme nakrájenou cibuli, papriku a případně žampiony. Vše společně restujeme doměkka.",
      "Připravíme si těsto na bramboráky: Brambory nastrouháme najemno, přidáme vejce, prolisovaný česnek, mouku a koření. Důkladně promícháme.",
      "Na rozpálené pánvi s olejem tvoříme větší bramboráky.",
      "Jakmile je bramborák z jedné strany opečený, na polovinu naneseme kuřecí směs, přehneme a dopékáme z obou stran dozlatova.",
      "Podáváme teplé, posypané sýrem nebo s tatarskou omáčkou."
    ]
  },
  {
    nazev: "Hovězí guláš",
    popis: "Tradiční český guláš z hovězího masa, dušený na cibulovém základě s paprikou. Hustá a voňavá omáčka se skvěle hodí ke knedlíkům nebo chlebu.",
    kategorie: "Masové jedlá",
    obrazek: "",
    ingredience: [
      "600g hovězí kližky",
      "3 velké cibule",
      "3 lžíce sádla nebo oleje",
      "2 lžíce sladké mleté papriky",
      "1 lžička pálivé papriky (volitelné)",
      "1 lžíce rajského protlaku",
      "1 lžička kmínu",
      "2 stroužky česneku",
      "Majoránka",
      "Hovězí vývar nebo voda na podlití",
      "Sůl, pepř"
    ],
    postup: [
      "Cibuli nakrájíme najemno a na sádle ji restujeme do tmavě zlaté barvy. Trvá to i 15 minut.",
      "Odstavíme z ohně, přidáme mletou papriku a rychle zamícháme, aby nezhořkla. Přidáme protlak a vrátíme na oheň.",
      "Maso nakrájené na kostky přidáme k cibulovému základu a ze všech stran ho orestujeme.",
      "Osolíme, opepříme, přidáme kmín, zalijeme vývarem tak, aby bylo maso téměř ponořené, a přikryté dusíme doměkka (cca 1.5 - 2 hodiny).",
      "Během dušení občas promícháme a podle potřeby podléváme.",
      "Když je maso měkké, přidáme prolisovaný česnek a promnutou majoránku. Necháme ještě 5 minut provařit a případně dochutíme.",
      "Guláš by měl být zahuštěný cibulí a rozvařeným masem, není třeba ho dále zahušťovat."
    ]
  }
];