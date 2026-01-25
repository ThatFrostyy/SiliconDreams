// src/components/Trading.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { ShoppingCart, DollarSign, Tag, Package, RefreshCw, Filter, ArrowRightLeft, Search, X, Monitor } from 'lucide-react';
import { PART_TYPES, PARTS_CATALOG } from '../data/constants';
import { PartIcon, CategoryTabs } from './Shared';

export default function Trading({ inventory, onPostTrade, money, onBuyTrade, onItemTrade, user, darkMode }) {
  const [trades, setTrades] = useState([]);
  const [sellingItem, setSellingItem] = useState(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [marketFilter, setMarketFilter] = useState('ALL');
  const [sellFilter, setSellFilter] = useState('ALL');

  // Trade Mode
  const [tradeMode, setTradeMode] = useState('SELL'); // 'SELL' or 'TRADE'
  const [wantedType, setWantedType] = useState(Object.values(PART_TYPES)[0]);
  const [wantedPartName, setWantedPartName] = useState('');

  // Buying/Trading State
  const [selectedTrade, setSelectedTrade] = useState(null); // The trade we are trying to fulfill
  const [offerItem, setOfferItem] = useState(null); // The item we are offering

  // Listen for active trades
  useEffect(() => {
    const q = query(collection(db, 'market'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrades(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!sellingItem || !user) return;
    if (tradeMode === 'SELL' && (isNaN(price) || Number(price) <= 0)) return alert("Invalid price");
    
    setLoading(true);
    try {
      const tradeData = {
        part: sellingItem,
        sellerId: user.uid,
        sellerName: "Player " + user.uid.substr(0, 4),
        createdAt: serverTimestamp(),
        type: tradeMode
      };

      if (tradeMode === 'SELL') {
        tradeData.price = Number(price);
      } else {
        tradeData.wantedType = wantedType;
        if (wantedPartName) tradeData.wantedPartName = wantedPartName;
      }

      // Add to Firestore
      await addDoc(collection(db, 'market'), tradeData);
      
      // Remove from local inventory
      onPostTrade(sellingItem.invId);
      setSellingItem(null);
      setPrice('');
    } catch (error) {
      console.error("Error posting trade:", error);
      alert("Failed to post trade");
    }
    setLoading(false);
  };

  const handleTransaction = async (trade, offeredItem = null) => {
    if (!user) {
        alert("Please log in to trade.");
        return;
    }
    if (trade.sellerId === user.uid) {
        alert("You cannot buy your own items.");
        return;
    }
    if (trade.type === 'SELL' && money < trade.price) return alert("Not enough money!");
    if (trade.type === 'TRADE' && !offeredItem) return alert("Select an item to trade!");

    setLoading(true);
    try {
      console.log(`Processing trade ${trade.id} with seller ${trade.sellerId}`);

      await runTransaction(db, async (transaction) => {
        const tradeRef = doc(db, 'market', trade.id);
        const tradeDoc = await transaction.get(tradeRef);
        if (!tradeDoc.exists()) throw new Error("Trade no longer exists!");

        // Delete trade from market
        transaction.delete(tradeRef);

        // Send to Seller's Inbox (Safe Pattern)
        // We create a new document reference inside the seller's inbox
        const inboxRef = doc(collection(db, 'users', trade.sellerId, 'inbox'));
        
        if (trade.type === 'SELL') {
            transaction.set(inboxRef, {
                type: 'EARNINGS',
                amount: trade.price,
                timestamp: serverTimestamp(),
                from: user.uid
            });
        } else {
            const { invId, ...cleanItem } = offeredItem;
            transaction.set(inboxRef, {
                type: 'ITEM',
                item: cleanItem,
                timestamp: serverTimestamp(),
                from: user.uid
            });
        }
      });

      // Update local state
      if (trade.type === 'SELL') {
          onBuyTrade(trade.part, trade.price);
      } else {
          onItemTrade(trade.part, offeredItem.invId);
      }
      setSelectedTrade(null);
      setOfferItem(null);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.message}`);
    }
    setLoading(false);
  };

  const filteredInventory = inventory.filter(p => sellFilter === 'ALL' ? true : (sellFilter === 'PC' ? p.type === 'PC' : p.type === sellFilter));
  const filteredTrades = trades.filter(t => marketFilter === 'ALL' || t.part.type === marketFilter);

  return (
    <div className="space-y-6">
      {/* SELL SECTION */}
      <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Tag className="text-emerald-500" /> Create Listing</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Inventory Selection */}
            <div className="lg:col-span-7 space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button onClick={() => setSellFilter('PC')} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${sellFilter === 'PC' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>PC</button>
                    <CategoryTabs current={sellFilter} set={setSellFilter} types={PART_TYPES} darkMode={darkMode} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                    {filteredInventory.map(part => (
                        <div 
                            key={part.invId} 
                            onClick={() => setSellingItem(part)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all relative group
                                ${sellingItem?.invId === part.invId 
                                    ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20' 
                                    : darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {part.type === 'PC' ? <Monitor size={16} /> : <PartIcon type={part.type} size={16} />}
                                <span className="text-[10px] font-bold uppercase opacity-50">{part.type}</span>
                            </div>
                            <div className="font-bold text-xs truncate">{part.name}</div>
                            <div className="text-[10px] opacity-60 mt-1">${part.price}</div>
                        </div>
                    ))}
                    {filteredInventory.length === 0 && <div className="col-span-full text-center py-8 opacity-50 text-xs">No items found</div>}
                </div>
            </div>

            {/* Right: Configuration */}
            <div className={`lg:col-span-5 p-4 rounded-xl border flex flex-col ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                {sellingItem ? (
                    <>
                        <div className="flex items-start gap-3 mb-4 pb-4 border-b border-dashed border-slate-600/30">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                                {sellingItem.type === 'PC' ? <Monitor size={24} /> : <PartIcon type={sellingItem.type} size={24} />}
                            </div>
                            <div>
                                <h3 className="font-bold">{sellingItem.name}</h3>
                                <p className="text-xs opacity-60">{sellingItem.type} • Est. ${sellingItem.price}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4 bg-slate-900/20 p-1 rounded-lg">
                            <button 
                                onClick={() => setTradeMode('SELL')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${tradeMode === 'SELL' ? 'bg-emerald-600 text-white shadow' : 'hover:bg-slate-500/10'}`}
                            >
                                Sell for Cash
                            </button>
                            <button 
                                onClick={() => setTradeMode('TRADE')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${tradeMode === 'TRADE' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-500/10'}`}
                            >
                                Item Trade
                            </button>
                        </div>

                        <div className="flex-1">
                            {tradeMode === 'SELL' ? (
                                <div>
                                    <label className="text-xs font-bold uppercase mb-1 block opacity-70">Listing Price ($)</label>
                                    <input 
                                        type="number" 
                                        className={`w-full p-3 rounded-lg border font-mono text-lg ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                                        placeholder={sellingItem.price}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="text-xs font-bold uppercase mb-1 block opacity-70">I want to receive:</label>
                                    <div className="space-y-2">
                                        <select 
                                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                                            value={wantedType}
                                            onChange={(e) => { setWantedType(e.target.value); setWantedPartName(''); }}
                                        >
                                            {Object.values(PART_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <select
                                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                                            value={wantedPartName}
                                            onChange={(e) => setWantedPartName(e.target.value)}
                                        >
                                            <option value="">Any {wantedType}</option>
                                            {PARTS_CATALOG.filter(p => p.type === wantedType).map(p => (
                                                <option key={p.id} value={p.name}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handlePost}
                            disabled={loading || (tradeMode === 'SELL' && !price)}
                            className="mt-4 w-full py-3 rounded-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Posting...' : 'Post Listing'}
                        </button>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-8">
                        <Package size={48} className="mb-2" />
                        <p className="text-sm font-bold">Select an item from your inventory to list it</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* MARKET SECTION */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="text-blue-500" /> Global Market</h2>
            <div className="w-1/2">
                <CategoryTabs current={marketFilter} set={setMarketFilter} types={{ PC: 'PC', ...PART_TYPES }} darkMode={darkMode} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrades.map(trade => (
            <div key={trade.id} className={`p-4 rounded-xl border flex flex-col gap-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className={`p-2 rounded-lg h-fit ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            {trade.part.type === 'PC' ? <Monitor size={20} /> : <PartIcon type={trade.part.type} size={20} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">{trade.part.name}</h3>
                            <p className="text-xs opacity-50 mb-1">Seller: {trade.sellerName}</p>
                            
                            {/* Detailed Specs */}
                            <div className="flex flex-wrap gap-2 text-[10px] font-mono opacity-70">
                                {trade.part.socket && <span className="bg-slate-500/10 px-1.5 py-0.5 rounded">Socket: {trade.part.socket}</span>}
                                {trade.part.speed && <span className="bg-slate-500/10 px-1.5 py-0.5 rounded">{trade.part.speed}MHz</span>}
                                {trade.part.capacity && <span className="bg-slate-500/10 px-1.5 py-0.5 rounded">{trade.part.capacity}GB</span>}
                                {trade.part.wattage && <span className="bg-slate-500/10 px-1.5 py-0.5 rounded">{trade.part.wattage}W</span>}
                                {trade.part.perf && <span className="text-amber-500 font-bold">Perf: {trade.part.perf}</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        {trade.type === 'SELL' ? (
                            <div className="text-xl font-black text-emerald-500">${trade.price}</div>
                        ) : (
                            <div className="flex items-center gap-1 text-xs font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
                                <ArrowRightLeft size={12} /> Wants {trade.wantedPartName || trade.wantedType}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Area */}
                <div className="pt-3 border-t border-dashed border-slate-700/50">
                    {user && trade.sellerId === user.uid ? (
                        <div className="text-center text-xs opacity-50 font-bold py-2">Your Listing</div>
                    ) : (
                        <>
                            {selectedTrade?.id === trade.id ? (
                                <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} animate-in fade-in slide-in-from-top-2`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold">Confirm Transaction</span>
                                        <button onClick={() => { setSelectedTrade(null); setOfferItem(null); }}><X size={14} /></button>
                                    </div>
                                    
                                    {trade.type === 'TRADE' && (
                                        <div className="mb-3">
                                            <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Select item to trade ({trade.wantedPartName || trade.wantedType}):</p>
                                            <select 
                                                className={`w-full p-2 text-xs rounded border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                                                onChange={(e) => setOfferItem(inventory.find(p => p.invId === e.target.value))}
                                                value={offerItem?.invId || ''}
                                            >
                                                <option value="">Select Item...</option>
                                                {inventory.filter(p => p.type === trade.wantedType && (!trade.wantedPartName || p.name === trade.wantedPartName)).map(p => (
                                                    <option key={p.invId} value={p.invId}>{p.name} (Perf: {p.perf})</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => handleTransaction(trade, offerItem)}
                                        disabled={loading || (trade.type === 'TRADE' && !offerItem)}
                                        className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : (trade.type === 'SELL' ? `Pay $${trade.price}` : 'Confirm Trade')}
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setSelectedTrade(trade)}
                                    className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
                                        ${trade.type === 'SELL' 
                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                            : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                >
                                    {trade.type === 'SELL' ? <><ShoppingCart size={16} /> Buy Now</> : <><ArrowRightLeft size={16} /> Trade Item</>}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            ))}
            {filteredTrades.length === 0 && (
                <div className="col-span-full text-center py-12 opacity-40">
                    <Search size={48} className="mx-auto mb-2" />
                    <p>No active listings found for this category.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
