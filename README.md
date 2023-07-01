[![npm version](https://badge.fury.io/js/koronapay.svg)](https://badge.fury.io/js/koronapay)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Koronapay

> CLI to get actual exchange rates from [koronapay service](https://koronapay.com/transfers/online/).

## Prerequisites

This project requires NodeJS (version 14.21.3 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
9.5.1
v18.16.0
```

## Table of contents

- [Koronapay](#koronapay)
    - [Prerequisites](#prerequisites)
    - [Table of contents](#table-of-contents)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Available commands](#available-commands)
          - [show-current](#show-current-exchange-rates)
          - [show-history](#show-exchange-rate-history)
          - [clear-history](#remove-exchange-rate-history)
        - [Available countries](#available-countries)
        - [Available currencies](#available-currencies)
    - [Contributing](#contributing)
    - [Authors](#authors)
    - [License](#license)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites).

To install, run:

```sh
$ npm i -g koronapay
```

## Usage

### Available commands

#### Show current exchange rates

```sh
$ koronapay show-current
```

```
Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -s, --save     Save request to the history.          [boolean] [default: true]
  -f, --from     Sending country.
  [string] [choices: "UZB", "RUS", "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DN
  K", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LIE", "LTU
  ", "LUX", "MLT", "NLD", "NOR", "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE"
  , "GBR", "KGZ", "AZE", "TUR", "MDA", "KAZ", "GEO", "BLR", "VNM", "ISR", "KOR",
                      "MKD", "SRB", "CHE", "TJK", "NPL", "CHN"] [default: "RUS"]
  -t, --to       Receiving country.
  [array] [choices: "UZB", "RUS", "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK
  ", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LIE", "LTU"
  , "LUX", "MLT", "NLD", "NOR", "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE",
    "GBR", "KGZ", "AZE", "TUR", "MDA", "KAZ", "GEO", "BLR", "VNM", "ISR", "KOR",
                    "MKD", "SRB", "CHE", "TJK", "NPL", "CHN"] [default: ["GEO"]]
```

#### Show exchange rate history

```sh
$ koronapay show-history
```

```
Options:
      --help                 Show help                                 [boolean]
      --version              Show version number                       [boolean]
  -f, --from                 Sending country.
  [string] [choices: "UZB", "RUS", "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DN
  K", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LIE", "LTU
  ", "LUX", "MLT", "NLD", "NOR", "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE"
  , "GBR", "KGZ", "AZE", "TUR", "MDA", "KAZ", "GEO", "BLR", "VNM", "ISR", "KOR",
                      "MKD", "SRB", "CHE", "TJK", "NPL", "CHN"] [default: "RUS"]
  -t, --to                   Receiving country.
  [string] [choices: "UZB", "RUS", "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DN
  K", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LIE", "LTU
  ", "LUX", "MLT", "NLD", "NOR", "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE"
  , "GBR", "KGZ", "AZE", "TUR", "MDA", "KAZ", "GEO", "BLR", "VNM", "ISR", "KOR",
                      "MKD", "SRB", "CHE", "TJK", "NPL", "CHN"] [default: "GEO"]
      --from-currency, --fc  Sending currency.
  [string] [choices: "USD", "RUB", "EUR", "AZN", "TRY", "MDL", "KZT", "GEL", "NP
                                                            R"] [default: "RUB"]
      --to-currency, --tc    Receiving currency.
  [string] [choices: "USD", "RUB", "EUR", "AZN", "TRY", "MDL", "KZT", "GEL", "NP
                                                            R"] [default: "GEL"]
  -d, --display              Display method.
                         [string] [choices: "table", "graph"] [default: "graph"]
```

#### Remove exchange rate history

```sh
$ koronapay clear-history
```

```
Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

### Available countries

- UZB
- RUS
- AUT
- BEL
- BGR
- HRV
- CYP
- CZE
- DNK
- EST
- FIN
- FRA
- DEU
- GRC
- HUN
- IRL
- ITA
- LVA
- LIE
- LTU
- LUX
- MLT
- NLD
- NOR
- POL
- PRT
- ROU
- SVK
- SVN
- ESP
- SWE
- GBR
- KGZ
- AZE
- TUR
- MDA
- KAZ
- GEO
- BLR
- VNM
- ISR
- KOR
- MKD
- SRB
- CHE
- TJK
- NPL
- CHN

### Available currencies

- USD
- RUB
- EUR
- AZN
- TRY
- MDL
- KZT
- GEL
- NPR

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am Add some feature`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Authors

* **George Terekhin** - [George Terekhin](https://github.com/terekhin-g)

See also the list of [contributors](https://github.com/terekhin-g/koronapay/graphs/contributors) who participated in this project.

## License

[ISC License](https://github.com/terekhin-g/koronapay/blob/main/LICENSE.md) © George Terekhin
