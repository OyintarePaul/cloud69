import { Form } from "react-router";
import { Input } from "../../components/ui/input";

const Search = () => {
  return (
    <Form action="search" className="w-full max-w-md bg-muted">
      <Input
        name="query"
        type="search"
        placeholder="Search"
        className="w-full"
      />
    </Form>
  );
};
export default Search;
