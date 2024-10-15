import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const Instructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Welcome, here are some general information about the quiz:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full px-3 py-2 max-w-2xl">
          <ol className="list-decimal">
            <li>Thirty randomly-chosen obscured logos will be shown to you.</li>
            <li>All logos are from a Singapore-based entity.</li>
            <li>You make a guess by typing into the text box below the logo and pressing the "Enter" key or clicking the "Guess" button.</li>
            <li>Depending on the logo, abbreviations are also accepted as answers. For example, both BMW and Bayerische Motoren Werke are accepted as answers.</li>
            <li>A hint is available after 10 seconds for every logo.</li>
            <li>You are able to skip an unlimited number of times.</li>
            <li>No answers will be provided if you choose to skip.</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}