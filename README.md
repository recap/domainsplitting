# Domain Splitting

#### Objective
We want to split and application workflow into domains such that we minimize the risk of leaking sensitive data.
#### Approach
First, we model an application as a workflow with vertices being data objects or function objects. Each object is assigned a sensitivity value from 0 - 1 with 1 being highly sensitive. 
Function nodes have the added capability of manipulating the input data sensitivity by reducing or increasing it. This is modelled as a multiplier to the input sensitivity e.g. 0.5 will reduce sensitivity of the input data by half. These values are set **manually**.

So for a simple workflow: 
$$D1 \to f() \to D2$$
Where the sensitivity of D1 is assigned to 1 and the multiplier of f() is 0.5 then the sesitivit of D2 is 1 x 0.5 = 0.5. 

Next we model domains: Domains are subgraphs of the workflow. In the above example workflow given 2 domains _A_ and _B_, the graph can be split into 8 different ways:
```
  [ 'A', 'A', 'A' ],
  [ 'A', 'A', 'B' ],
  [ 'A', 'B', 'A' ],
  [ 'A', 'B', 'B' ],
  [ 'B', 'A', 'A' ],
  [ 'B', 'A', 'B' ],
  [ 'B', 'B', 'A' ],
  [ 'B', 'B', 'B' ]
```

To capture the transfer of data between domain we introduce a cross-domain weight matrix e.g. 
```
    A   B
A   1   10
B   10  1
```
Now we can factor this in our cost calculation e.g. if D1 has to move between _A_ and _B_ then we multiply the sensitivity of D1 which is 1 with the cross-border weight which is 10. Moving D1 across a border will cost us 10 while moving D2 will cost us 5 (due to lower sensitivity). 

Next we can calculate to cost of every graph partitioning (our 8 solutions). The cost function gives us an indication on which partitions lower the sensitivity leak (one of the risks).

#### Using the code
``` 
node domainsplitting.js -a application01.json --domains A,B
```
