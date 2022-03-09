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
All informations start with "var". Here is the example:

```

var id = "my_custom_theory_id";

var name = "My Custom Theory";

var description = "A basic theory.";

var authors = "Skyhigh173";

var version = 1;

```

## Create your own variables

for variables, you can do like this.
(Example: you need variable a1, a2, n, k. It should look like this:)

```

var currency;
var a1, a2, n, k;

```
