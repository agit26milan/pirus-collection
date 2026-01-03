export const convertColumnValue = (obj: any) => {
  const dataBody = Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );
  const columns = Object.keys(dataBody);
  const values = Object.values(dataBody);
  return {
    columns,
    values,
  };
};
