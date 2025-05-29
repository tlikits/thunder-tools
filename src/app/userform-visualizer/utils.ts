export function parseUserFormToGraph(userform: any) {
  const APP_NODE_ID = "Application";
  const propertyNodes =
    userform?.values?.["Home Loan Multiple"]?.map(
      (property: any, idx: number) => ({
        type: "Property",
        name: `${property.amount}`,
        color: "navy",
        id: property.id,
        parent: userform?.SID,
      })
    ) || [];
  const loanNodes =
    Object.entries(
      userform?.values?.["Multiple Product Selection"] ?? {}
    )?.flatMap(([propertyId, propertyLoan]) => {
      return propertyLoan?.splitLoanData?.map((loan) => ({
        name: `${loan.loanAmount}`,
        color: "green",
        id: `${loan.id}`,
        parent: propertyId,
        type: "Loan",
      }));
    }) || [];

  const nodes = [
    {
      type: "Application",
      id: userform?.SID,
      name: APP_NODE_ID,
      color: "black",
      parent: null,
    },
    ...propertyNodes,
    ...loanNodes,
  ];

  const links = nodes
    .filter((node) => node.parent)
    .map((node) => ({
      source: node.parent,
      target: node.id,
    }));

  const graph = {
    nodes,
    links,
  };
  return graph;
}
