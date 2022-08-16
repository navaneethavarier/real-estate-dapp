pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RealEstateDapp is ERC721URIStorage {
    //Counters is a library, this command imports all functions inside the library
    using Counters for Counters.Counter;

    //Intialising variables
    Counters.Counter private _allTokenID;
    Counters.Counter private _solditems;
    address payable propowner = payable(msg.sender);
    uint256 listPrice = 0.001 ether;

    //Structure for information related to a property listing
    struct PropListing {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //events in Solidity are emitted when a condition is fulfilled, in this case when token for new listing creation is created successfully
    event ListingSuccess(
        uint256 indexed tokenId,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    //This is similar to HashMap in Java and maps token id with corresponding property details
    mapping(uint256 => PropListing) private propinfo;

    //Constructor
    constructor() ERC721("RealEstateDapp", "REDAPP") {
        propowner = payable(msg.sender);
    }

    function getOwner() public view returns (address) {
        return propowner;
    }

    //Function #1 - Updates info of a particular property listing whose id is passed as parameter
    function updateListPrice(uint256 _id, uint256 _listPrice)
        public
        payable
        returns (bool)
    {
        propinfo[_id].price = _listPrice;
        return true;
    }

    //Function #2 - Fetches the price of a listing
    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    //Function #3 - Fetch current token ID
    function getLatestIdToListedToken()
        public
        view
        returns (PropListing memory)
    {
        uint256 currentID = _allTokenID.current();
        return propinfo[currentID];
    }

    //Function #4 - Fetch token for ID provided in parameter
    function getListedTokenForId(uint256 id)
        public
        view
        returns (PropListing memory)
    {
        return propinfo[id];
    }

    //Function #5 - Get token of current ID
    function getCurrentToken() public view returns (uint256) {
        return _allTokenID.current();
    }

    //Function #6 - Function to create new token when new listing is created
    function createToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        _allTokenID.increment();
        uint256 newTokenId = _allTokenID.current();

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, tokenURI);

        createListedToken(newTokenId, price);

        return newTokenId;
    }

    //Function #7 - Supporting function for function#6
    function createListedToken(uint256 tokenId, uint256 price) private {
        require(
            msg.value == listPrice,
            "verifying if user is sending the correct price"
        );

        require(price > 0, "verifying the price is a positive number");

        propinfo[tokenId] = PropListing(tokenId, payable(msg.sender), price);

        _transfer(msg.sender, address(this), tokenId);

        emit ListingSuccess(tokenId, msg.sender, price, true);
    }

    //Function #8 - Fetch all the property listings
    function getAllListings() public view returns (PropListing[] memory) {
        uint256 listingsCount = _allTokenID.current();
        PropListing[] memory tokens = new PropListing[](listingsCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < listingsCount; i++) {
            uint256 currentId = i + 1;
            PropListing storage currentItem = propinfo[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        return tokens;
    }

    //Function #9 - Fetch investments of a particular user
    function getMyInvestments() public view returns (PropListing[] memory) {
        uint256 totalItemCount = _allTokenID.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (propinfo[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        PropListing[] memory items = new PropListing[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (propinfo[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                PropListing storage currentItem = propinfo[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    //Function #10 - Function to execute transfer of ownership during property sale
    function executeSale(uint256 tokenId) public payable {
        uint256 price = propinfo[tokenId].price;
        address seller = propinfo[tokenId].seller;
        require(
            msg.value == price,
            "Please pay the selling price of the property to complete transaction"
        );

        // propinfo[tokenId].currListed = true;
        propinfo[tokenId].seller = payable(msg.sender);
        _solditems.increment();

        _transfer(address(this), msg.sender, tokenId);

        approve(address(this), tokenId);

        payable(seller).transfer(listPrice);

        payable(seller).transfer(msg.value);
    }
}
