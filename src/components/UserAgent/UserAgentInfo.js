import React, { useState, useEffect } from 'react';
import './UserAgentInfo.css';

import desktopCommonUserAgents from '../../data/Desktop_Common_Useragents.json';
import linuxDesktopUserAgents from '../../data/Linux_Desktop_Useragents.json';
import macOSUserAgents from '../../data/MacOS_Useragents.json';
import mobileCommonUserAgents from '../../data/Mobile_Common_Useragents.json';
import windowsCommonUserAgents from '../../data/Windows_Common_Useragents.json';
import iPadUserAgents from '../../data/iPad_Useragents.json';
import iPhoneUserAgents from '../../data/iPhone_Useragents.json';
import iPodUserAgents from '../../data/iPod_Useragents.json';

const UserAgentInfo = () => {
  const [userAgents, setUserAgents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    try {
      const userAgentData = [
        desktopCommonUserAgents,
        linuxDesktopUserAgents,
        macOSUserAgents,
        mobileCommonUserAgents,
        windowsCommonUserAgents,
        iPadUserAgents,
        iPhoneUserAgents,
        iPodUserAgents
      ];

      const groupedAgents = {
        'Windows': [],
        'macOS': [],
        'Linux': [],
        'iPhone': [],
        'iPad': [],
        'iPod': [],
        'Android': []
      };

      userAgentData.forEach(data => {
        data.forEach(agent => {
          if (agent.os.includes('Windows')) {
            groupedAgents['Windows'].push(agent);
          } else if (agent.os.includes('Mac OS X')) {
            groupedAgents['macOS'].push(agent);
          } else if (agent.os.includes('Linux')) {
            groupedAgents['Linux'].push(agent);
          } else if (agent.device === 'iPhone') {
            groupedAgents['iPhone'].push(agent);
          } else if (agent.device === 'iPad') {
            groupedAgents['iPad'].push(agent);
          } else if (agent.device === 'iPod') {
            groupedAgents['iPod'].push(agent);
          } else if (agent.os.includes('Android')) {
            groupedAgents['Android'].push(agent);
          }
        });
      });

      // Sort each group by version (descending)
      Object.keys(groupedAgents).forEach(key => {
        groupedAgents[key].sort((a, b) => {
          const versionA = parseFloat(a.version);
          const versionB = parseFloat(b.version);
          return versionB - versionA;
        });
      });

      setUserAgents(groupedAgents);
      setLoading(false);
    } catch (err) {
      console.error('Error in processing user agent data:', err);
      setError('Failed to process user agent data');
      setLoading(false);
    }
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) return <div>Loading user agent data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Agents and Browser Fingerprinting</h2>
      
      <h3 className="text-xl font-semibold mb-2">Motivation</h3>
      <p className="mb-4">
        In the fields of SEO, marketing, web scraping, and application testing, proxies and user agents are essential tools. They help bypass automation detection programs and geo-restrictions by routing traffic through different IP addresses and mimicking various browser configurations. Developers and software engineers often need to use different user agents and proxies to test web applications across various platforms and devices. This ensures that their applications work correctly for all users, regardless of the device or browser they're using.
      </p>

      <h3 className="text-xl font-semibold mb-2">What are User Agents?</h3>
      <p className="mb-4">
        A user agent is a string of text that web browsers and other applications send to identify themselves to websites. It typically includes information about the browser, its version, the operating system, and sometimes additional details about the user's system. Websites use this information to optimize content delivery and functionality based on the user's browser capabilities.
      </p>

      <h3 className="text-xl font-semibold mb-2">Browser Fingerprinting</h3>
      <p className="mb-4">
        Browser fingerprinting is a powerful technique used by websites to identify and track users based on the unique characteristics of their browser and device configuration. This method goes beyond traditional tracking methods like cookies, making it harder for users to prevent. The Electronic Frontier Foundation (EFF) provides detailed information about this practice on their <a href="https://coveryourtracks.eff.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Cover Your Tracks</a> website.
      </p>

      <p className="mb-4">
        Key components of a browser fingerprint include the user agent string, screen resolution, color depth, installed plugins and fonts, time zone and language settings, and even more advanced techniques like HTML5 canvas fingerprinting, WebGL fingerprinting, and audio context fingerprinting. These elements combine to create a unique profile that can identify a user across different websites, even if they're using private browsing mode or clearing their cookies.
      </p>

      <p className="mb-4">
        While browser fingerprinting can have legitimate uses in fraud prevention and security, it also raises significant privacy concerns. Users often have little control over their fingerprint and may be unaware of how uniquely identifiable they are online. The EFF's Cover Your Tracks tool allows users to see how their browser appears to tracking companies and learn about ways to protect their privacy.
      </p>

      <h3 className="text-xl font-semibold mb-2">HTTP Requests and Headers</h3>
      <p className="mb-4">
        When a web browser or any other client makes a request to a web server, it sends an HTTP request. This request includes various headers that provide information about the client and the type of request being made. Here's an example of a simple HTTP GET request:
      </p>
      <pre className="bg-gray-100 p-2 rounded mb-4">
        <code>
{`GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive`}
        </code>
      </pre>
      <p className="mb-4">
        In this example, each line after the first represents a different header. Headers provide metadata about the request or the client making the request. The 'User-Agent' header, in particular, identifies the client software making the request.
      </p>

      <h3 className="text-xl font-semibold mb-2">User Agents in HTTP Requests</h3>
      <p className="mb-4">
        The User-Agent string is sent as part of the HTTP headers in every request a browser makes. It typically includes information about the browser, its version, the operating system, and sometimes additional details about the user's system. Here's an example of how you might use JavaScript to send a custom User-Agent in an HTTP request:
      </p>
      <pre className="bg-gray-100 p-2 rounded mb-4">
        <code>
{`fetch('https://api.example.com/data', {
  headers: {
    'User-Agent': 'MyApp/1.0 (Custom User Agent String)'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
        </code>
      </pre>
      <p className="mb-4">
        In this example, we're using the Fetch API to make a request and setting a custom User-Agent header. This allows the server to identify the client making the request and potentially tailor its response based on this information.
      </p>

      <h3 className="text-xl font-semibold mb-2">User Agent Database</h3>
      <p className="mb-4">
        Below, you'll find a comprehensive list of user agents grouped by device type. This database is typically updated automatically every week to ensure it remains current with the latest browser versions and device configurations. We strive to maintain an up-to-date collection to assist developers, testers, and researchers in their work.
      </p>

      <h3 className="text-xl font-semibold mb-2">User Agents by Device Type</h3>
      {Object.entries(userAgents).map(([deviceType, agents]) => (
        <div key={deviceType} className="mb-4">
          <button 
            onClick={() => toggleSection(deviceType)}
            className="w-full text-left p-2 bg-gray-200 hover:bg-gray-300"
          >
            {deviceType} User Agents
          </button>
          {openSection === deviceType && (
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Browser</th>
                    <th className="px-4 py-2">Version</th>
                    <th className="px-4 py-2">OS</th>
                    <th className="px-4 py-2">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{agent.browser}</td>
                      <td className="border px-4 py-2">{agent.version}</td>
                      <td className="border px-4 py-2">{agent.os}</td>
                      <td className="border px-4 py-2 max-w-xs truncate">{agent.userAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserAgentInfo;