# This is the tutorial for making a CT.


## beginning
You need to import these things first:

```

import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";

import { Localization } from "./api/Localization";

import { BigNumber } from "./api/BigNumber";

import { theory } from "./api/Theory";

import { Utils } from "./api/Utils";

```

You can also import other things. (examples : UI )

## Theory informations

you need id, name, description, authors and version.
All informations start with `var`. Here is the example:

```

var id = "my_custom_theory_id";

var name = "My Custom Theory";

var description = "A basic theory.";

var authors = "Skyhigh173";

var version = 1;

```
Notice that dont make `var version` like this :

> 1.1.2

> 1.3

> alpha

> -1

it must be an integer.
## Create your own variables

for variables, you can do this.
(Example: you need variable a1, a2, n, k. It should look like this:)

```

var currency;
var a1, a2, n, k;

```
You also need to add more variables such as `Term` or `Exp`.

###### Term variable
You will need this if you create a term upgrade in Milestone.
Example: (var = a, n)
```
var aTerm, nTerm;
```
What is term?
It works like this:
1st equation : `a+b_1`

2nd equation (after buy) :` a+b_1+c`

###### Exp variable
You will need this when your variable have a power (a^b).

Example (n^2)
```
var n;
var nExp;
```
## Chapter
Thid is easy to add.
```
var chapter1, chapter2;
```
## main
This is the main script of the game.

###### init
