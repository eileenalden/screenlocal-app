import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Percent, Shield, Check } from "lucide-react";

export default function PermitSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Permits & Tax Incentives
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate Oakland's film regulations and maximize your tax savings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Film Permits */}
          <Card className="bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 text-orange-500 mr-3" />
                Film Permits
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <p className="text-gray-600 mb-4">
                Streamlined application process for Oakland filming permits
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-4 flex-1">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Location permits
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Street closures
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Noise permits
                </li>
              </ul>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-auto">
                Start Application
              </Button>
            </CardContent>
          </Card>

          {/* Tax Rebates */}
          <Card className="bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-6 w-6 text-teal-500 mr-3" />
                Tax Rebates
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <p className="text-gray-600 mb-4">
                Up to 25% rebate on qualified production expenses
              </p>
              <div className="bg-white rounded-lg p-4 mb-4 flex-1">
                <div className="text-2xl font-bold text-teal-500 mb-1">$2,587</div>
                <div className="text-sm text-gray-600">Estimated rebate for your project</div>
              </div>
              <Button className="w-full bg-teal-500 hover:bg-teal-600 mt-auto">
                Check Eligibility
              </Button>
            </CardContent>
          </Card>

          {/* Insurance */}
          <Card className="bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 text-yellow-600 mr-3" />
                Insurance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <p className="text-gray-600 mb-4">
                Production insurance and liability coverage
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-4 flex-1">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  General liability
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Equipment coverage
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Errors & omissions
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Workers' compensation
                </li>
              </ul>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 mt-auto">
                Get Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
